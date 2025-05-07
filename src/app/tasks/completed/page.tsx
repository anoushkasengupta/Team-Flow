'use client';

import TaskList from '../../../components/dashboard/tasks/TaskList';

export default function CompletedTasksPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Completed Tasks</h1>
      <TaskList filter="completed" refreshFlag={false} />
    </div>
  );
}
