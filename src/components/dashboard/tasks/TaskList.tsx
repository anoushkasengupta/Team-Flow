'use client';

import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email?: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  createdBy: string;
  assignedTo: string;
}

interface TaskListProps {
  filter: string;
  refreshFlag: boolean;
  search?: string;
  onTaskChange?: () => void;
}

export default function TaskList({ filter, refreshFlag, search, onTaskChange }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users to map IDs to names
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/tasks?filter=${filter}`);
        console.log('Fetching tasks with filter:', filter, 'Response status:', res.status);
        if (!res.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await res.json();
        console.log('Fetched tasks:', data);
        setTasks(data);
      } catch (err: unknown) {
        console.error('Error fetching tasks:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [filter, refreshFlag]);

  // Call onTaskChange after task changes (example: after fetchTasks for now)
  // You should also call this after task create/update/delete in your real handlers
  useEffect(() => {
    if (onTaskChange) {
      onTaskChange();
    }
    // Only call onTaskChange when refreshFlag changes (i.e., after a task change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag]);

  // Helper function to get user name from ID
  const getUserName = (userId: string) => {
    const user = users.find(u => u._id === userId);
    return user ? user.name : 'Unknown User';
  };

  let filteredTasks = tasks;
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filteredTasks = tasks.filter(
      t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (filteredTasks.length === 0) return <p>No tasks found.</p>;

  return (
    <ul className="space-y-4">
      {filteredTasks.map((task) => (
        <li
          key={task._id}
          className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
        >
          <h3 className="text-xl font-bold mb-2 text-blue-700">{task.title}</h3>
          <p className="mb-3 text-gray-700">{task.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Due:</span> {new Date(task.dueDate).toLocaleDateString()}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Status:</span> 
              <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.status === 'in-progress' ? 'In Progress' : 
                  task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Created By:</span> {getUserName(task.createdBy)}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Assigned To:</span> {getUserName(task.assignedTo)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
