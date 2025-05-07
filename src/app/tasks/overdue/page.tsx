'use client';

import TaskList from '../../../components/dashboard/tasks/TaskList';

export default function OverdueTasksPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Overdue Tasks</h1>
      <TaskList filter="overdue" refreshFlag={false} />
    </div>
  );
}
