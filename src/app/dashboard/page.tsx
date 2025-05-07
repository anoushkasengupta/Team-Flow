'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import TaskList from '../../components/dashboard/tasks/TaskList';

interface Task {
  _id: string;
  title: string;
  createdAt: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    async function fetchTasks() {
      const res = await fetch('/api/all-tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
      } else {
        console.error('Error fetching tasks:', res.status);
      }
    }
    fetchTasks();
  }, []);

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
            {tasks.map((task) => (
              <div key={task._id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-medium">
                  {task.title[0]}
                </div>
                <div className="flex-1">
                  <p className="text-white">
                    <span className="font-medium">{task.title}</span>
                  </p>
                  <p className="text-xs text-gray-500">Created at: {task.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
