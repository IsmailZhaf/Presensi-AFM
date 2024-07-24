'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronsLeft,
  ChevronsRight,
  GraduationCap,
  Hand,
  LayoutIcon,
  LogOut,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion, useAnimation } from 'framer-motion';

export const SideNav = () => {
  const router = useRouter();
  const controls = useAnimation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      path: '/dashboard/santri',
    },
    {
      id: 3,
      name: 'Kehadiran',
      icon: Hand,
      path: '/dashboard/kehadiran',
    },
  ];
  const path = usePathname();

  const toggleMenu = async () => {
    // Set animasi saat menu dibuka
    await controls.start({
      opacity: isMenuOpen ? 0 : 1,
      x: isMenuOpen ? -10 : 0,
      animation: 'infinite',
      transition: { duration: 2, delay: 1 },
    });

    // Set animasi saat menu ditutup
    if (!isMenuOpen) {
      await controls.start({
        opacity: 0,
        x: -10,
        transition: { duration: 0.5, delay: 2 },
        animation: 'backwards',
      });
    }

    // Update status menu
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {}, [path]);
  return (
    <div className="absolute">
      <div className="hidden md:block md:p-5">
        <div>
          <Image
            src={'/LOGO.png'}
            width={180}
            height={50}
            alt="logo"
            className="w-30 h-30"
          />
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
      </div>
      <motion.div
        className={`md:hidden relative h-screen p-5 z-20 ${
          isMenuOpen ? 'bg-white border shadow-md' : 'bg-transparent'
        }`}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'keyframes', duration: 0.5, delay: 0.5 }}
      >
        <button onClick={toggleMenu}>
          <ChevronsRight className={`${isMenuOpen ? 'hidden' : 'block'}`} />
          <ChevronsLeft className={`${!isMenuOpen ? 'hidden' : 'block'}`} />
        </button>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Image
              src={'/LOGO.png'}
              width={180}
              height={50}
              alt="logo"
              className="w-30 h-30"
            />
            <hr className="my-5" />
            {menuList.map((menu, index) => (
              <Link href={menu.path} onClick={toggleMenu}>
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
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
