'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import TaskList from '../../../components/dashboard/tasks/TaskList';
import TaskForm from '../../../components/dashboard/tasks/TaskForm';

const sections = [
  { key: 'assigned', label: 'Tasks Assigned' },
  { key: 'created', label: 'Tasks Created' },
  { key: 'overdue', label: 'Overdue Tasks' },
  { key: 'completed', label: 'Completed Tasks' },
  { key: 'add', label: 'Add New Task' },
];

export default function TasksDashboard() {
  const [activeSection, setActiveSection] = useState('assigned');
  const [refreshFlag, setRefreshFlag] = useState(false);
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';

  const refreshTasks = () => setRefreshFlag(!refreshFlag);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tasks Dashboard</h1>
      <nav className="mb-6">
        <ul className="flex space-x-6 border-b border-gray-300">
          {sections.map(({ key, label }) => (
            <li key={key}>
              <button
                className={`pb-2 font-semibold ${
                  activeSection === key ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveSection(key)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        {activeSection === 'add' ? (
          <TaskForm onTaskSaved={refreshTasks} />
        ) : (
          <>
            <TaskList filter={activeSection} refreshFlag={refreshFlag} search={search} />
          </>
        )}
      </div>
    </div>
  );
}
