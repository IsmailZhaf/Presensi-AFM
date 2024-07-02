import { db } from "@/utils";
import { KELAS } from "@/utils/schema";
import { NextResponse } from "next/server";

export async function GET() {
    const result = await db.select().from(KELAS);
    return NextResponse.json(result);
}
