import { db } from '@/utils';
import { SANTRI } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req, res) {
  const data = await req.json();

  const result = await db.insert(SANTRI).values({
    nama: data?.nama,
    kelas: data?.kelas,
    angkatan: data?.angkatan,
    NIS: data?.NIS,
  });

  return NextResponse.json(result);
}

export async function PUT(req, res) {
  const data = await req.json();

  const result = await db.insert(SANTRI).values({
    nama: data?.nama,
    kelas: data?.kelas,
    angkatan: data?.angkatan,
    NIS: data?.NIS,
  });

  return NextResponse.json(result);
}

export async function GET(req) {
  const result = await db.select().from(SANTRI);
  return NextResponse.json(result);
}

export async function DELETE(req) {
  const searchParams = req.nextUrl.searchParams;
  const NIS = searchParams.get('NIS');

  const result = await db.delete(SANTRI).where(eq(SANTRI.NIS, NIS));
  return NextResponse.json(result);
}
