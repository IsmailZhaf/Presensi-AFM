'use client';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import GlobalApi from '@/app/_services/GlobalApi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleLogin(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const data = JSON.stringify({
      email,
      password,
    });

    try {
      const res = await GlobalApi.Login(data);
      // Handle successful login response, e.g., set token in local storage
      router.push('/dashboard');
      toast(res.data.message);
    } catch (error) {
      // Handle login error, e.g., show error message
      toast('Gagal Login');
    }
  }

  return (
    <main className="flex justify-center items-center h-screen bg-[url('/mf.png')] bg-cover bg-center">
      <form
        onSubmit={handleLogin}
        className=" p-5 space-y-2  flex flex-col items-center bg-gray-500/60 rounded-lg shadow-xl"
      >
        <section className="text-gray-800">
          <p className="text-center">
            ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ
          </p>
          {/* <h1 className="text-xl font-medium tracking-tight">Login</h1> */}
          <p>Selamat Datang! Silahkan Login</p>
        </section>
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
        <Button type="submit">Login</Button>
        <Link href={'/register'} className="text-sm text-white">
          Buat Akun
        </Link>
      </form>
    </main>
  );
};
