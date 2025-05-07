'use client';

import { useEffect, useState } from 'react';

interface AuditLog {
  _id: string;
  userId: { name: string; email: string } | string;
  action: string;
  taskId?: { title: string } | string;
  details?: any;
  timestamp: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/audit-logs?limit=50');
        if (!res.ok) throw new Error('Failed to fetch logs');
        const data = await res.json();
        setLogs(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded shadow text-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-700">Timestamp</th>
              <th className="px-4 py-2 border border-gray-700">User</th>
              <th className="px-4 py-2 border border-gray-700">Action</th>
              <th className="px-4 py-2 border border-gray-700">Task</th>
              <th className="px-4 py-2 border border-gray-700">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td className="px-4 py-2 border border-gray-700">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2 border border-gray-700">{typeof log.userId === 'object' ? `${log.userId.name} (${log.userId.email})` : log.userId}</td>
                <td className="px-4 py-2 border border-gray-700">{log.action}</td>
                <td className="px-4 py-2 border border-gray-700">{typeof log.taskId === 'object' ? log.taskId.title : log.taskId || '-'}</td>
                <td className="px-4 py-2 border border-gray-700 text-xs max-w-xs overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-all">{log.details ? JSON.stringify(log.details, null, 2) : '-'}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 