require('dotenv').config();
import bcrypt from 'bcrypt';
import { ADMIN } from '@/utils/schema';
import { NextResponse } from 'next/server';
import { db } from '@/utils';
import { eq } from 'drizzle-orm';

export async function POST(req) {
  const { nama, email, password, key } = await req.json();
  const secretKey = process.env.SECRET_KEY;

  console.log('nama', nama);
  console.log('email', email);
  console.log('password', password);
  console.log('key', key);

  if (!nama || !email || !password || !key) {
    return NextResponse.json({ message: 'Lengkapi Data' }, { status: 400 });
  }

  if (key !== secretKey) {
    return NextResponse.json({ message: 'Key Salah' }, { status: 400 });
  }

  const existingUser = await db
    .select()
    .from(ADMIN)
    .where(eq(ADMIN.email, email))
    .execute();
  if (existingUser.length > 0) {
    return NextResponse.json(
      { error: 'Email Sudah Terdaftar' },
      { status: 400 }
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.insert(ADMIN).values({
    nama: nama,
    email: email,
    password: hashedPassword,
  });

  return NextResponse.json({ message: 'Berhasil Menambahkan Admin' });
}
