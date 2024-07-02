import { db } from "@/utils";
import { SANTRI, KBM_Pagi, KBM_Malam } from "@/utils/schema"; // Pastikan KBM_Pagi dan KBM_Malam diimpor
import { asc, and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const kegiatan = searchParams.get("kegiatan");
        const date = searchParams.get("date");
        const grade = searchParams.get("grade");

        console.log("date: ", date);

        let ATTENDANCE;
        if (kegiatan === "KBM_Pagi") {
            ATTENDANCE = KBM_Pagi;
        } else if (kegiatan === "KBM_Malam") {
            ATTENDANCE = KBM_Malam;
        }

        // Pastikan ATTENDANCE sudah diatur dengan benar
        if (!ATTENDANCE) {
            return NextResponse.json({ error: "Invalid kegiatan parameter" }, { status: 400 });
        }

        // Pastikan parameter date dan grade ada
        if (!date || !grade) {
            return NextResponse.json({ error: "Missing date or grade parameter" }, { status: 400 });
        }

        const result = await db
            .select({
                day: ATTENDANCE.day,
                presentCount: sql`count(${ATTENDANCE.day})`,
            })
            .from(ATTENDANCE)
            .leftJoin(SANTRI, and(eq(ATTENDANCE.NIS, SANTRI.NIS), eq(ATTENDANCE.date, date)))
            .groupBy(ATTENDANCE.day)
            .where(eq(SANTRI.kelas, grade))
            .orderBy(asc(ATTENDANCE.day))
            .limit(7);

        console.log(result);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
