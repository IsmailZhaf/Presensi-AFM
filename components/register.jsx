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
    event.preventDefault(); // Prevent default form submission behavior

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
        className=" p-5 space-y-2  flex flex-col items-center bg-gray-500/40 rounded-lg shadow-xl"
      >
        <section className="text-white">
          <h1 className="text-xl font-medium tracking-tight">Daftar</h1>
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
        <Link href={'/login'} className="text-sm text-white">
          Login
        </Link>
      </form>
    </main>
  );
};
