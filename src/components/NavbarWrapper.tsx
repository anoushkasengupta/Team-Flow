'use client';

import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';

export default function NavbarWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith('/dashboard')) return null;
  return <Navbar />;
} 