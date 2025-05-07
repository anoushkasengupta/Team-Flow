'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { SocketProvider } from '@/components/layout/SocketProvider';
import { NotificationProvider } from '@/components/layout/NotificationProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <NotificationProvider>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col bg-gradient-to-br from-black via-gray-900 to-gray-800">
            <Header />
            <main className="flex-1 overflow-y-auto p-6 text-white">
              {children}
            </main>
          </div>
        </div>
      </NotificationProvider>
    </SocketProvider>
  );
} 