'use client';

import { useState, Suspense } from 'react';
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

interface TasksDisplayContentProps {
  activeSection: string;
  refreshFlag: boolean;
  onTaskSaved: () => void;
}

function TasksDisplayContent({ activeSection, refreshFlag, onTaskSaved }: TasksDisplayContentProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';

  return (
    <>
      {activeSection === 'add' ? (
        <TaskForm onTaskSaved={onTaskSaved} />
      ) : (
        <TaskList filter={activeSection} refreshFlag={refreshFlag} search={search} />
      )}
    </>
  );
}

export default function TasksDashboard() {
  const [activeSection, setActiveSection] = useState('assigned');
  const [refreshFlag, setRefreshFlag] = useState(false);

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
                  activeSection === key
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
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
        <Suspense fallback={<div>Loading...</div>}>
          <TasksDisplayContent
            activeSection={activeSection}
            refreshFlag={refreshFlag}
            onTaskSaved={refreshTasks}
          />
        </Suspense>
      </div>
    </div>
  );
}
