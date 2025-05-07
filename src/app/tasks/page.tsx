'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useState } from 'react';

function TaskFilter() {
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value);
  };

  return (
    <div className="mb-4 flex items-center">
      <label htmlFor="status" className="mr-2">Status:</label>
      <select id="status" value={status} onChange={handleStatusChange} className="border rounded px-2 py-1 mr-2">
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="overdue">Overdue</option>
      </select>
      <label htmlFor="priority" className="mr-2">Priority:</label>
      <select id="priority" value={priority} onChange={handlePriorityChange} className="border rounded px-2 py-1 mr-2">
        <option value="">All</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">Filter</button>
    </div>
  );
}

export default function TasksPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>

      <Suspense fallback={<div>Loading...</div>}>
        <TaskFilter />
      </Suspense>

      <ul className="space-y-2">
        <li>
          <Link href="/tasks/assigned" className="text-blue-600 hover:underline">
            Tasks Assigned
          </Link>
        </li>
        <li>
          <Link href="/tasks/created" className="text-blue-600 hover:underline">
            Tasks Created
          </Link>
        </li>
        <li>
          <Link href="/tasks/overdue" className="text-blue-600 hover:underline">
            Overdue Tasks
          </Link>
        </li>
        <li>
          <Link href="/tasks/completed" className="text-blue-600 hover:underline">
            Completed Tasks
          </Link>
        </li>
      </ul>
    </div>
  );
}
