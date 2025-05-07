'use client';

import { Search, BellRing, Plus, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNotifications } from './NotificationProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

export function Header() {
  const { notifications, markAsRead, clearAll, unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-11 items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && search.trim()) {
                    router.push(`/dashboard/tasks?search=${encodeURIComponent(search.trim())}`);
                  }
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <BellRing className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                  {notifications.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        clearAll();
                        setIsOpen(false);
                      }}
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id}
                        className={`p-3 border-b last:border-0 cursor-default ${!notification.read ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-start gap-2 w-full">
                          <div className={`mt-1 ${notification.type === 'task' ? 'text-blue-500' : 'text-green-500'}`}>
                            {notification.type === 'task' ? <Plus size={16} /> : <BellRing size={16} />}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{notification.title}</div>
                            <div className="text-xs text-gray-500 mt-1">{notification.message}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </div>
                          </div>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-1 p-1 h-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                            >
                              <Check size={14} />
                            </Button>
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
} 