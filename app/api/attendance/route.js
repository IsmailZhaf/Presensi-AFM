import { KBM_Pagi, KBM_Malam, SANTRI } from '@/utils/schema';
import { NextResponse } from 'next/server';
import { sql, eq, and, count } from 'drizzle-orm';

const { db } = require('@/utils');

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const kegiatan = searchParams.get('kegiatan');
  const grade = searchParams.get('grade');
  const month = searchParams.get('month');


//   let ATTENDANCE;
//   if (kegiatan === 'KBM_Pagi') {
//     ATTENDANCE = KBM_Pagi;
//   } else if (kegiatan === 'KBM_Malam') {
//     ATTENDANCE = KBM_Malam;
//   } 

  try {
    let pagiResult = [];
    let malamResult = [];

    if (kegiatan === 'KBM_Pagi' || kegiatan === 'Seluruh') {
      pagiResult = await db
        .select({
          nama: SANTRI.nama,
          present: KBM_Pagi.present,
          day: KBM_Pagi.day,
          date: KBM_Pagi.date,
          kelas: SANTRI.kelas,
          NIS: SANTRI.NIS,
          attendanceId: KBM_Pagi.id,
        })
        .from(SANTRI)
        .leftJoin(
          KBM_Pagi,
          and(eq(KBM_Pagi.date, month), eq(SANTRI.NIS, KBM_Pagi.NIS))
        )
        .where(eq(SANTRI.kelas, grade))
        .execute();
    }

    if (kegiatan === 'KBM_Malam' || kegiatan === 'Seluruh') {
      malamResult = await db
        .select({
          nama: SANTRI.nama,
          present: KBM_Malam.present,
          day: KBM_Malam.day,
          date: KBM_Malam.date,
          kelas: SANTRI.kelas,
          NIS: SANTRI.NIS,
          attendanceId: KBM_Malam.id,
        })
        .from(SANTRI)
        .leftJoin(
          KBM_Malam,
          and(eq(KBM_Malam.date, month), eq(SANTRI.NIS, KBM_Malam.NIS))
        )
        .where(eq(SANTRI.kelas, grade))
        .execute();
    }

    // Gabungkan hasil dari pagiResult dan malamResult
    const result = [...pagiResult, ...malamResult];

    return NextResponse.json(result);
    // const result = await db
    //   .select({
    //     nama: SANTRI.nama,
    //     present: ATTENDANCE.present,
    //     day: ATTENDANCE.day,
    //     date: ATTENDANCE.date,
    //     kelas: SANTRI.kelas,
    //     NIS: SANTRI.NIS,
    //     attendanceId: ATTENDANCE.id,
    //   })
    //   .from(SANTRI)
    //   .leftJoin(
    //     ATTENDANCE,
    //     and(eq(ATTENDANCE.date, month), eq(SANTRI.NIS, ATTENDANCE.NIS))
    //   )
    //   .where(eq(SANTRI.kelas, grade))
    //   .execute();

    // return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/attendance:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req, res) {
  const searchParams = req.nextUrl.searchParams;
  const kegiatan = searchParams.get('kegiatan');
  const totalPoints = searchParams.get('totalPoints');
  const selectedMonth = searchParams.get('selectedMonth');
  console.log('selectedMonth: ', selectedMonth);
  console.log('points: ', totalPoints);
  const data = await req.json();
  let ATTENDANCE;

  if (kegiatan === 'KBM_Pagi') {
    ATTENDANCE = KBM_Pagi;
  } else if (kegiatan === 'KBM_Malam') {
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

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in POST /api/attendance:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const searchParams = req.nextUrl.searchParams;
  const NIS = searchParams.get('NIS');
  const date = searchParams.get('date');
  const kegiatan = searchParams.get('kegiatan');
  const day = searchParams.get('day');
  let ATTENDANCE;
  if (kegiatan === 'KBM_Pagi') {
    ATTENDANCE = KBM_Pagi;
  } else if (kegiatan === 'KBM_Malam') {
    ATTENDANCE = KBM_Malam;
  }

  const result = await db
    .delete(ATTENDANCE)
    .where(
      and(
        eq(ATTENDANCE.NIS, NIS),
        eq(ATTENDANCE.day, day),
        eq(ATTENDANCE.date, date)
      )
    );

  const santri = await db
    .select({ poin: SANTRI.poin })
    .from(SANTRI)
    .where(eq(SANTRI.NIS, NIS))
    .execute();

  if (santri.length > 0) {
    const currentPoin = parseInt(santri[0].poin, 10);
    const updatedPoin = currentPoin - 10;

    await db
      .update(SANTRI)
      .set({ poin: updatedPoin })
      .where(eq(SANTRI.NIS, NIS));
  }
  return NextResponse.json(result);
}
