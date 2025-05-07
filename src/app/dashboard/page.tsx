'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import TaskList from '../../components/dashboard/tasks/TaskList';

const sections = [
  { key: 'assigned', label: 'Tasks Assigned' },
  { key: 'created', label: 'Tasks Created' },
  { key: 'overdue', label: 'Overdue Tasks' },
  { key: 'completed', label: 'Completed Tasks' },
];

const activities = [
  { user: 'Alex', action: 'completed', task: 'Task A', time: '2h ago' },
  { user: 'Priya', action: 'was assigned', task: 'Task B', time: '4h ago' },
  { user: 'Chris', action: 'created', task: 'Task C', time: '6h ago' },
  { user: 'You', action: 'updated', task: 'Task D', time: '1d ago' },
];

export default function Dashboard() {
  const [testSent, setTestSent] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [counts, setCounts] = useState({ assigned: 0, created: 0, overdue: 0, completed: 0 });
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    async function fetchCounts() {
      const filters = ['assigned', 'created', 'overdue', 'completed'];
      const results: Record<string, number> = {};
      await Promise.all(
        filters.map(async (filter) => {
          const res = await fetch(`/api/tasks?filter=${filter}`);
          if (res.ok) {
            const data = await res.json();
            results[filter] = Array.isArray(data) ? data.length : 0;
          } else {
            results[filter] = 0;
          }
        })
      );
      setCounts({
        assigned: results.assigned || 0,
        created: results.created || 0,
        overdue: results.overdue || 0,
        completed: results.completed || 0,
      });
    }
    fetchCounts();
  }, [refreshFlag]);

  const handleTaskChange = () => setRefreshFlag((f) => !f);

  const sendTestNotification = async () => {
    try {
      setTestSent(true);
      const res = await fetch('/api/socket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'taskAssigned',
          data: {
            taskId: 'test-' + Date.now(),
            taskTitle: 'Test Task',
            assignedBy: 'Admin',
            assignedTo: 'current-user'
          }
        }),
      });
      
      const data = await res.json();
      console.log('Test notification result:', data);
      
      setTimeout(() => setTestSent(false), 3000);
    } catch (error) {
      console.error('Error sending test notification:', error);
      setTestSent(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Welcome, User</h1>
        
        <Button 
          onClick={sendTestNotification} 
          disabled={testSent}
          variant={testSent ? "secondary" : "default"}
        >
          {testSent ? 'Notification Sent!' : 'Test Notification'}
        </Button>
      </div>
      
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full max-w-xl border rounded px-3 py-2 text-black"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && search.trim()) {
              router.push(`/dashboard?search=${encodeURIComponent(search.trim())}`);
            }
          }}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {sections.map((section) => (
          <div
            key={section.key}
            className="bg-black/30 backdrop-blur-sm rounded-lg p-6 shadow-lg"
          >
            <h2 className="text-lg font-medium mb-2 text-white/80">{section.label}</h2>
            <p className="text-4xl font-bold text-blue-400">{counts[section.key as keyof typeof counts]}</p>
          </div>
        ))}
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        <TaskList filter="assigned" refreshFlag={refreshFlag} search={searchQuery} onTaskChange={handleTaskChange} />
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
        
        <div className="lg:col-span-2 bg-black/30 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Task Distribution</h2>
          <div className="flex items-center justify-center h-64 text-gray-500">
            Chart coming soon...
          </div>
        </div>
      </div>
    </div>
  );
} 