'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import TaskList from '../../components/dashboard/tasks/TaskList';

const activities = [
  { user: 'Alex', action: 'completed', task: 'Task A', time: '2h ago' },
  { user: 'Priya', action: 'was assigned', task: 'Task B', time: '4h ago' },
  { user: 'Chris', action: 'created', task: 'Task C', time: '6h ago' },
  { user: 'You', action: 'updated', task: 'Task D', time: '1d ago' },
];

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold">Welcome</h1>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        <TaskList filter="assigned" search={searchQuery} refreshFlag={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-black/30 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-medium">
                  {activity.user[0]}
                </div>
                <div className="flex-1">
                  <p className="text-white">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-gray-400">{activity.action}</span>{' '}
                    <span className="font-medium">{activity.task}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
