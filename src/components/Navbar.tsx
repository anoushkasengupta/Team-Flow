'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const isAuthenticated = false; // Replace with your auth logic
const user = {
  name: 'Jane Doe',
  avatar: '/avatar.png',
  role: 'Owner',
};

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-blue-600">Taskify</Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex flex-1 justify-center">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-6 items-center h-14">
            <NavigationMenuItem>
              <Link href="/" className="hover:text-blue-600 transition-colors font-medium">Home</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" className="hover:text-blue-600 transition-colors font-medium">About Us</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/dashboard" className="hover:text-blue-600 transition-colors font-medium">Dashboard</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/pricing" className="hover:text-blue-600 transition-colors font-medium">Super Pricing Plan</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/how-to-use" className="hover:text-blue-600 transition-colors font-medium">How to Use the Software</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" className="hover:text-blue-600 transition-colors font-medium">Docs</Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Right Side: Auth/User */}
      <div className="hidden md:flex items-center gap-4">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button className="w-full text-left">Sign Out</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="flex flex-col h-full">
              <div className="px-6 py-4 border-b">
                <Link href="/" className="text-2xl font-bold text-blue-600" onClick={() => setOpen(false)}>
                  Taskify
                </Link>
              </div>
              <nav className="flex flex-col gap-2 px-6 py-4">
                <Link href="/" className="py-2" onClick={() => setOpen(false)}>Home</Link>
                <Link href="/about" className="py-2" onClick={() => setOpen(false)}>About Us</Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start w-full">Dashboard</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/tasks" onClick={() => setOpen(false)}>Tasks</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/team" onClick={() => setOpen(false)}>Team</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/calendar" onClick={() => setOpen(false)}>Calendar</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" onClick={() => setOpen(false)}>Settings</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/pricing" className="py-2" onClick={() => setOpen(false)}>Super Pricing Plan</Link>
                <Link href="/how-to-use" className="py-2" onClick={() => setOpen(false)}>How to Use the Software</Link>
                <Link href="/docs" className="py-2" onClick={() => setOpen(false)}>Docs</Link>
              </nav>
              <div className="mt-auto px-6 py-4 border-t flex gap-2">
                {isAuthenticated ? (
                  <Button className="w-full" variant="outline">Sign Out</Button>
                ) : (
                  <>
                    <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link href="/register" className="w-full">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
} 