import { KBM_Pagi, KBM_Malam, SANTRI } from "@/utils/schema";
import { NextResponse } from "next/server";
import { sql, eq, isNull, or, and } from "drizzle-orm";
import moment from "moment";

const { db } = require("@/utils");

export async function GET(req, res) {
    const searchParams = req.nextUrl.searchParams;
    const kegiatan = searchParams.get("kegiatan");
    const totalPoints = searchParams.get("totalPoints");
    const NIS = searchParams.get("NIS");

    let ATTENDANCE;

    if (kegiatan === "KBM_Pagi") {
        ATTENDANCE = KBM_Pagi;
    } else if (kegiatan === "KBM_Malam") {
        ATTENDANCE = KBM_Malam;
    }

    console.log("kegiatan:", kegiatan);

    try {
        const firstDayOfMonth = moment().startOf("month").format("DD/MM/YYYY");
        const lastDayOfMonth = moment().endOf("month").format("DD/MM/YYYY");
        const currentMonth = moment().format("MM/YYYY");

        const currentYear = new Date().getFullYear();

        // Mendapatkan jumlah hari dalam bulan ini
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const santri = await db
            .select({
                poin: SANTRI.poin,
                lastUpdatedMonth: SANTRI.lastUpdatedMonth,
            })
            .from(SANTRI)
            .where(eq(SANTRI.NIS, NIS))
            .execute();

        const currentPoin = parseInt(santri[0].poin, 10) || 0;
        const lastUpdatedMonth = santri[0].lastUpdatedMonth;
        console.log("lastUpdatedMonth: ", lastUpdatedMonth);

        let updatedPoin;

        if (lastUpdatedMonth !== currentMonth) {
            // This is the first attendance record for the current month
            const totalAttendancesQuery = await db
                .select({
                    count: sql`COUNT(*)`,
                })
                .from(ATTENDANCE)
                .where(sql`${ATTENDANCE.NIS} = ${NIS} AND ${ATTENDANCE.present} = true AND ${ATTENDANCE.date} BETWEEN ${firstDayOfMonth} AND ${lastDayOfMonth}`)
                .execute();

            const totalAttendances = totalAttendancesQuery[0].count || 0;
            const daysInMonth = moment().daysInMonth();
            const pointInMonth = daysInMonth * 10;

            updatedPoin = currentPoin + parseInt(totalPoints, 10) * 2 + 10;
            // Update the last updated month
            await db.update(SANTRI).set({ lastUpdatedMonth: currentMonth }).where(eq(SANTRI.NIS, NIS)).execute();
        } else {
            // Add 10 points for this attendance
            updatedPoin = currentPoin + 10;
        }

        await db.update(SANTRI).set({ poin: updatedPoin }).where(eq(SANTRI.NIS, NIS)).execute();
        console.log("Updated Point: ", updatedPoin);

        return NextResponse.json(updatedPoin);
    } catch (error) {
        console.error("Error in POST /api/attendance:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
