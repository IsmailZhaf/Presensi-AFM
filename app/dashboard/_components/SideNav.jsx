'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, Hand, LayoutIcon, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const SideNav = () => {
  const router = useRouter();
  const handleLogOut = () => {
    Cookies.remove('token');
    toast('Log Out');
    router.push('/login');
  };
  const menuList = [
    {
      id: 1,
      name: 'Dashboard',
      icon: LayoutIcon,
      path: '/dashboard',
    },
    {
      id: 2,
      name: 'Santri',
      icon: GraduationCap,
      path: '/dashboard/students',
    },
    {
      id: 3,
      name: 'Kehadiran',
      icon: Hand,
      path: '/dashboard/attendance',
    },
  ];
  const path = usePathname();

  useEffect(() => {}, [path]);
  return (
    <div className="border shadow-md h-screen p-5">
      <Image src={'/LOGO.png'} width={180} height={50} alt="logo" />
      <hr className="my-5" />

      {menuList.map((menu, index) => (
        <Link href={menu.path}>
          <h2
            key={index}
            className={`flex items-center gap-3 p-5 hover:bg-[#a2d712] hover:text-white cursor-pointer rounded-lg my-2
                    ${path === menu.path && 'bg-[#a2d712] text-white'}
                    `}
          >
            <menu.icon />
            {menu.name}
          </h2>
        </Link>
      ))}

      <div
        className="flex gap-3 p-5 items-center cursor-pointer"
        onClick={handleLogOut}
      >
        <LogOut /> Log Out
      </div>
    </div>
  );
};
