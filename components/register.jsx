'use client';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import GlobalApi from '@/app/_services/GlobalApi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export const Register = () => {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [key, setKey] = useState('');
  const router = useRouter();

  async function handleRegister(event) {
    event.preventDefault();

    const data = JSON.stringify({
      nama,
      email,
      password,
      key,
    });

    try {
      const res = await GlobalApi.Register(data);
      // Handle successful login response, e.g., set token in local storage
      router.push('/dashboard');
      toast(res.data.message);
    } catch (error) {
      // Handle login error, e.g., show error message
      toast('Gagal Membuat Akun');
    }
  }

  return (
    <main className="flex justify-center items-center h-screen bg-[url('/mf.png')] bg-cover bg-center">
      <form
        onSubmit={handleRegister}
        className="p-8 space-y-2  md:w-[400px] md:h-[350px] flex flex-col items-center justify-center bg-[#C4D0E7]/60 rounded-lg shadow-xl"
      >
        <section className="text-gray-800">
          <p className="text-center">
            ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ
          </p>
          <p>Selamat Datang! Silahkan Daftar</p>
        </section>
        <Input
          name="nama"
          type="text"
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="focus:outline-none"
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="focus:outline-none"
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="focus:outline-none"
        />
        <Input
          name="key"
          type="password"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="focus:outline-none"
        />
        <Button type="submit">Buat Akun</Button>
        <Link href={'/login'} className="text-sm text-[#233126]">
          Login
        </Link>
      </form>
    </main>
  );
};
