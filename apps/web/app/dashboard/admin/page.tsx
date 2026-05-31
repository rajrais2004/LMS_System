'use client';

import { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Toast } from '../../../components/ui/toast';
import { apiFetch } from '../../../services/api';

export default function AdminDashboardPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ logs: any[] }>('/api/audit')
      .then((data) => setLogs(data.logs))
      .catch((err) => setError(err.message || 'Unable to load audit logs'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <div className="space-y-6">
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Admin panel</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Audit log and system oversight</h1>
            </div>
            <p className="text-sm text-slate-400">View every loan stage update and action history.</p>
          </div>
        </Card>
        {loading ? (
          <p className="text-slate-300">Loading audit logs…</p>
        ) : logs.length === 0 ? (
          <Card><p className="text-slate-400">No audit entries are available yet.</p></Card>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <Card key={log._id} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{log.user?.name ?? 'Unknown user'}</p>
                    <p className="text-sm text-slate-400">{log.user?.role ?? 'N/A'}</p>
                  </div>
                  <span className="text-sm uppercase tracking-[0.2em] text-slate-400">{new Date(log.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-300">{log.action}</p>
                {log.meta && <p className="text-xs text-slate-500">{JSON.stringify(log.meta)}</p>}
              </Card>
            ))}
          </div>
        )}
        {error && <Toast message={error} />}
      </div>
    </main>
  );
}
