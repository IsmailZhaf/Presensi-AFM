import { KBM_Pagi, KBM_Malam, SANTRI } from "@/utils/schema";
import { NextResponse } from "next/server";
import { sql, eq, isNull, or, and } from "drizzle-orm";
import moment from "moment";

const { db } = require("@/utils");

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const kegiatan = searchParams.get("kegiatan");
    const grade = searchParams.get("grade");
    const month = searchParams.get("month");
    let ATTENDANCE;
    if (kegiatan === "KBM_Pagi") {
        ATTENDANCE = KBM_Pagi;
    } else if (kegiatan === "KBM_Malam") {
        ATTENDANCE = KBM_Malam;
    }

    try {
        const result = await db
            .select({
                nama: SANTRI.nama,
                present: ATTENDANCE.present,
                day: ATTENDANCE.day,
                date: ATTENDANCE.date,
                kelas: SANTRI.kelas,
                NIS: SANTRI.NIS,
                attendanceId: ATTENDANCE.id,
            })
            .from(SANTRI)
            .leftJoin(ATTENDANCE, and(eq(ATTENDANCE.date, month), eq(SANTRI.NIS, ATTENDANCE.NIS)))
            .where(eq(SANTRI.kelas, grade))
            .execute();


        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in GET /api/attendance:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req, res) {
    const searchParams = req.nextUrl.searchParams;
    const kegiatan = searchParams.get("kegiatan");
    const totalPoints = searchParams.get("totalPoints");
    const selectedMonth = searchParams.get("selectedMonth");
    console.log("selectedMonth: ", selectedMonth);
    console.log("points: ", totalPoints);
    const data = await req.json();
    let ATTENDANCE;

    if (kegiatan === "KBM_Pagi") {
        ATTENDANCE = KBM_Pagi;
    } else if (kegiatan === "KBM_Malam") {
        ATTENDANCE = KBM_Malam;
    }

    try {
        // Insert attendance record
        const result = await db
            .insert(ATTENDANCE)
            .values({
                NIS: data.NIS,
                present: data.present,
                day: data.day,
                date: data.date,
            })
            .execute();

        // Mengambil tahun dan bulan saat ini

        // Mendapatkan hari pertama dan terakhir bulan ini
        const firstDayOfMonth = moment().startOf("month").format("DD/MM/YYYY");
        const lastDayOfMonth = moment().endOf("month").format("DD/MM/YYYY");

        const year = moment(selectedMonth).format("YYYY"); // Formatnya "YYYY" untuk mendapatkan tahun 4 digit
        const month = moment(selectedMonth).format("MM"); // Formatnya "MM" untuk mendapatkan bulan 2 digit

        function getWeekdaysInMonth(year, month) {
            const weekdays = [];
            const startDate = moment(`${month}/${year}`, "MM/YYYY").startOf("month");
            const endDate = moment(`${month}/${year}`, "MM/YYYY").endOf("month");

            let currentDate = startDate;

            while (currentDate <= endDate) {
                const dayOfWeek = currentDate.day(); // 0: Sunday, 1: Monday, ..., 6: Saturday
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    // Exclude Sunday (0) and Saturday (6)
                    weekdays.push(currentDate.format("DD"));
                }
                currentDate.add(1, "day");
            }
            console.log("Weekdays: ", weekdays);
            return weekdays;
        }

        // Mendapatkan jumlah hari dalam bulan ini
        const totalDaysInMonth = getWeekdaysInMonth(year, month);

        // Get the number of days the student was present in the current month
        // Count the number of days the student was present in the current month
        const attendancesQuery = await db.execute(
            sql`SELECT COUNT(*) as count FROM ${ATTENDANCE} WHERE ${ATTENDANCE.NIS} = ${data.NIS} AND ${ATTENDANCE.present} = TRUE AND ${ATTENDANCE.date} BETWEEN ${firstDayOfMonth} AND ${lastDayOfMonth}`
        );

        // Ensure the result is accessible
        const attendances = attendancesQuery.rows; // Adjust depending on how `execute` returns results
        console.log("Attendance Query Result:", attendances);

        console.log("Total days: ", totalDaysInMonth);

        const daysPresent = parseInt(attendances[0].count, 10);
        console.log("daysPresent: ", daysPresent);
        const daysAbsent = totalDaysInMonth - daysPresent;
        console.log("daysAbsent: ", daysAbsent);

        // Calculate total points
        const pointsFromAbsence = daysAbsent * -10;
        // const totalPoints = 300 + pointsFromAbsence;
        console.log("pointsFromAbsence: ", pointsFromAbsence);

        // if (data.present) {
        //     const totalAttendances = attendancesQuery[0].count || 0;

        //     console.log("Total attendances in the month:", totalAttendances);
        //     console.log("Total points:", totalPoints);

        // Update points if the student is present

        // const santri = await db.select({ poin: SANTRI.poin }).from(SANTRI).where(eq(SANTRI.NIS, data.NIS)).execute();

        // if (santri.length > 0) {
        //     const currentPoin = parseInt(santri[0].poin, 10) || 0;
        //     const points = parseInt(totalPoints, 10);
        //     const updatedPoin = currentPoin + points;
        //     console.log("currentPoin:", currentPoin);
        //     console.log("updatedPoin:", updatedPoin);

        //     await db.update(SANTRI).set({ poin: updatedPoin }).where(eq(SANTRI.NIS, data.NIS)).execute();
        // }
        // }

        return NextResponse.json(pointsFromAbsence);
    } catch (error) {
        console.error("Error in POST /api/attendance:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// export async function POST(req, res) {
//     let number = 0;
//     const searchParams = req.nextUrl.searchParams;
//     const kegiatan = searchParams.get("kegiatan");
//     const data = await req.json();
//     let ATTENDANCE;

//     if (kegiatan === "KBM_Pagi") {
//         ATTENDANCE = KBM_Pagi;
//     } else if (kegiatan === "KBM_Malam") {
//         ATTENDANCE = KBM_Malam;
//     }

//     try {
//         // Insert attendance record
//         const result = await db
//             .insert(ATTENDANCE)
//             .values({
//                 NIS: data.NIS,
//                 present: data.present,
//                 day: data.day,
//                 date: data.date,
//             })
//             .execute();

//         // Mengambil tahun dan bulan saat ini
//         const currentYear = new Date().getFullYear();
//         const currentMonth = new Date().getMonth() + 1;
//         // Mendapatkan hari pertama dan terakhir bulan ini
//         const firstDayOfMonth = moment().startOf("month").format("DD/MM/YYYY");
//         const lastDayOfMonth = moment().endOf("month").format("DD/MM/YYYY");
//         // Mendapatkan jumlah hari dalam bulan ini
//         const totalDaysInMonth = moment().daysInMonth();
//         console.log(`Current Month: ${currentMonth}, Current Year: ${currentYear}`);
//         console.log(`First Day of Month: ${firstDayOfMonth}, Last Day of Month: ${lastDayOfMonth}`);
//         // Count the number of days the student was present in the current month
//         const attendancesQuery = await db.execute(
//             sql`SELECT COUNT(*) as count FROM ${ATTENDANCE} WHERE ${ATTENDANCE.NIS} = ${data.NIS} AND ${ATTENDANCE.present} = TRUE AND ${ATTENDANCE.date} BETWEEN ${firstDayOfMonth} AND ${lastDayOfMonth}`
//         );
//         // Ensure the result is accessible
//         const attendances = attendancesQuery.rows; // Adjust depending on how `execute` returns results
//         console.log("Attendance Query Result:", attendances);
//         const daysPresent = parseInt(attendances[0].count, 10);
//         const daysAbsent = totalDaysInMonth - daysPresent;
//         // Calculate total points
//         const pointsFromPresence = daysPresent * 10;
//         const pointsFromAbsence = daysAbsent * -10;
//         const totalPoints = pointsFromPresence + pointsFromAbsence;
//         console.log("pointsFromPresence: ", pointsFromPresence);
//         console.log("pointsFromAbsence: ", pointsFromAbsence);
//         console.log("totalPoints: ", totalPoints);
//         // Update points for the student
//         const santri = await db.select({ poin: SANTRI.poin }).from(SANTRI).where(eq(SANTRI.NIS, data.NIS)).execute();
//         console.log("Santri fetched:", santri);
//         if (santri.length > 0) {
//             const currentPoin = parseInt(santri[0].poin, 10);
//             if (currentPoin === 300) {
//                 const updatedPoin = currentPoin + totalPoints - 10;
//                 console.log("Updating points to:", updatedPoin);
//                 await db.update(SANTRI).set({ poin: updatedPoin }).where(eq(SANTRI.NIS, data.NIS)).execute();
//                 console.log("Points updated for NIS:", data.NIS);
//             } else {
//                 if (data.present) {
//                     const santri = await db.select({ poin: SANTRI.poin }).from(SANTRI).where(eq(SANTRI.NIS, data.NIS)).execute();

//                     if (santri.length > 0) {
//                         const currentPoin = parseInt(santri[0].poin, 10);
//                         const updatedPoin = currentPoin + 10;

//                         await db.update(SANTRI).set({ poin: updatedPoin }).where(eq(SANTRI.NIS, data.NIS));
//                     }
//                 }
//             }
//         }

//         return NextResponse.json(result);
//     } catch (error) {
//         console.error("Error in POST /api/attendance:", error);
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }

export async function DELETE(req) {
    const searchParams = req.nextUrl.searchParams;
    const NIS = searchParams.get("NIS");
    const date = searchParams.get("date");
    const kegiatan = searchParams.get("kegiatan");
    const day = searchParams.get("day");
    let ATTENDANCE;
    if (kegiatan === "KBM_Pagi") {
        ATTENDANCE = KBM_Pagi;
    } else if (kegiatan === "KBM_Malam") {
        ATTENDANCE = KBM_Malam;
    }

    const result = await db.delete(ATTENDANCE).where(and(eq(ATTENDANCE.NIS, NIS), eq(ATTENDANCE.day, day), eq(ATTENDANCE.date, date)));

    const santri = await db.select({ poin: SANTRI.poin }).from(SANTRI).where(eq(SANTRI.NIS, NIS)).execute();

    if (santri.length > 0) {
        const currentPoin = parseInt(santri[0].poin, 10);
        const updatedPoin = currentPoin - 10;

        await db.update(SANTRI).set({ poin: updatedPoin }).where(eq(SANTRI.NIS, NIS));
    }
    return NextResponse.json(result);
}
