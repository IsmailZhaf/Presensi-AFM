import { db } from "@/utils";
import { Kegiatan } from "@/utils/schema";
import { NextResponse } from "next/server";

export async function GET() {
    const result = await db.select().from(Kegiatan);
    return NextResponse.json(result);
}