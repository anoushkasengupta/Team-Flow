'use client';

import { useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
}

interface TaskFormProps {
  onTaskSaved: () => void;
}

export default function TaskForm({ onTaskSaved }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pending');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recurring, setRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState('daily');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await res.json();
        setUsers(data);
        if (data.length > 0) {
          setAssignedTo(data[0]._id);
        }
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchUsers();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          dueDate,
          status,
          assignedTo,
          recurring,
          recurrenceType: recurring ? recurrenceType : null,
          recurrenceEndDate: recurring ? recurrenceEndDate : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create task');
      }
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('pending');
      setAssignedTo(users.length > 0 ? users[0]._id : '');
      setRecurring(false);
      setRecurrenceType('daily');
      setRecurrenceEndDate('');
      onTaskSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded mt-4 space-y-4">
      <h2 className="text-lg font-semibold">Create New Task</h2>
      {error && <p className="text-red-600">{error}</p>}
      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded px-2 py-1"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Assign To</label>
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          required
          className="w-full border rounded px-2 py-1"
        >
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="flex items-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={recurring}
            onChange={e => setRecurring(e.target.checked)}
            className="mr-2"
          />
          Recurring Task
        </label>
      </div>
      {recurring && (
        <>
          <div>
            <label className="block mb-1 font-medium">Recurrence Type</label>
            <select
              value={recurrenceType}
              onChange={e => setRecurrenceType(e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Recurrence End Date (optional)</label>
            <input
              type="date"
              value={recurrenceEndDate}
              onChange={e => setRecurrenceEndDate(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
        </>
      )}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Task'}
      </button>
    </form>
  );
}
