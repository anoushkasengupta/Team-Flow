'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSocketContext } from './SocketProvider';
import { 
  Toast,
  ToastProvider,
  ToastViewport, 
  ToastClose, 
  ToastTitle, 
  ToastDescription 
} from "@/components/ui/toast";
import { Bell } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'team' | 'task' | 'system';
}

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  markAsRead: () => {},
  clearAll: () => {},
  unreadCount: 0
});

export function useNotifications() {
  return useContext(NotificationContext);
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [openToast, setOpenToast] = useState<string | null>(null);
  const { socket } = useSocketContext();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    console.log('NotificationProvider: Socket is', socket ? 'connected' : 'not connected');
    
    if (!socket) return;

    // Load existing notifications from localStorage
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {
        console.error('Failed to parse saved notifications', e);
      }
    }

    // Listen for team member added event
    socket.on('teamMemberAdded', (data: { teamId: string, userId: string, teamName: string, userName: string }) => {
      console.log('NotificationProvider: Received teamMemberAdded event', data);
      const newNotification: Notification = {
        id: `team-${Date.now()}`,
        title: 'New Team Member',
        message: `You've been added to ${data.teamName}`,
        timestamp: Date.now(),
        read: false,
        type: 'team'
      };
      
      addNotification(newNotification);
    });

    // Listen for task assigned event
    socket.on('taskAssigned', (data: { taskId: string, taskTitle: string, assignedBy: string }) => {
      console.log('NotificationProvider: Received taskAssigned event', data);
      const newNotification: Notification = {
        id: `task-${Date.now()}`,
        title: 'New Task Assigned',
        message: `Task "${data.taskTitle}" has been assigned to you by ${data.assignedBy}`,
        timestamp: Date.now(),
        read: false,
        type: 'task'
      };
      
      addNotification(newNotification);
    });

    return () => {
      socket.off('teamMemberAdded');
      socket.off('taskAssigned');
    };
  }, [socket]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = (notification: Notification) => {
    console.log('Adding notification:', notification);
    setNotifications(prev => [notification, ...prev].slice(0, 20)); // Limit to 20 notifications
    setOpenToast(notification.id); // Open toast for new notification
    
    // Auto-close toast after 5 seconds
    setTimeout(() => {
      setOpenToast(null);
    }, 5000);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, clearAll, unreadCount }}>
      <ToastProvider>
        {children}
        
        {/* Toast notification */}
        {openToast && notifications.find(n => n.id === openToast) && (
          <Toast 
            open={true} 
            onOpenChange={() => setOpenToast(null)}
            className="fixed top-4 right-4 w-80 z-50 bg-white shadow-lg border rounded-lg p-4"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Bell className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3 w-0 flex-1">
                <ToastTitle className="text-sm font-medium text-gray-900">
                  {notifications.find(n => n.id === openToast)?.title}
                </ToastTitle>
                <ToastDescription className="mt-1 text-sm text-gray-500">
                  {notifications.find(n => n.id === openToast)?.message}
                </ToastDescription>
              </div>
              <ToastClose className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500" />
            </div>
          </Toast>
        )}
        
        <ToastViewport />
      </ToastProvider>
    </NotificationContext.Provider>
  );
} 