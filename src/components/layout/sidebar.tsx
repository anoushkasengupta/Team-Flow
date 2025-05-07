'use client';

import Link from 'next/link';
// import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ListTodo, Settings, LogOut, Users, Home } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tasks', href: '/dashboard/tasks', icon: ListTodo },
  { name: 'Team', href: '/dashboard/team', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-y-4 overflow-y-auto bg-gradient-to-br from-black via-gray-900 to-gray-800 px-3 pb-3 min-w-[60px] max-w-[180px]">
      <div className="flex h-14 shrink-0 items-center">
        <span className="text-3xl font-bold text-blue-600">Taskify</span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-5">
          <li>
            <ul role="list" className="-mx-1 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        isActive
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800',
                        'group flex gap-x-2 rounded-md p-2 text-xs leading-5 font-semibold'
                      )}
                    >
                      <item.icon
                        className="h-5 w-5 shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          <li className="mt-auto">
            <Link
              href="/"
              className="flex items-center gap-x-2 rounded-md p-2 text-xs font-semibold text-gray-400 hover:bg-gray-800 hover:text-white mb-2"
              aria-label="Home"
            >
              <Home className="h-5 w-5 shrink-0" aria-hidden="true" />
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/auth/login"
              className="group -mx-1 flex gap-x-2 rounded-md p-2 text-xs font-semibold leading-5 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
} 