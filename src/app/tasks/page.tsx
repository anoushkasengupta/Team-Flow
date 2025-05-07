'use client';

import Link from 'next/link';

export default function TasksPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
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
