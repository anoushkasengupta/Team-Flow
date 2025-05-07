'use client';

import TaskList from '../../../components/dashboard/tasks/TaskList';

export default function CreatedTasksPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tasks Created</h1>
      <TaskList filter="created" refreshFlag={false} />
    </div>
  );
}
