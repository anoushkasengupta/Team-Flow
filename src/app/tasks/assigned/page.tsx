'use client';

import TaskList from '../../../components/dashboard/tasks/TaskList';

export default function AssignedTasksPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tasks Assigned</h1>
      <TaskList filter="assigned" refreshFlag={false} />
    </div>
  );
}
