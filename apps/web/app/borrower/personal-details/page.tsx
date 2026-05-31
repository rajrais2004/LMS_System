'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Toast } from '../../../components/ui/toast';
import { apiFetch } from '../../../services/api';

const employmentOptions = ['Salaried', 'Self-Employed', 'Contract', 'Unemployed'];

export default function PersonalDetailsPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    pan: '',
    dateOfBirth: '',
    monthlySalary: 25000,
    employmentMode: 'Salaried',
  });

  const [bre, setBre] = useState<{ approved: boolean; message: string } | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const data = await apiFetch<{
        application: any;
        bre: { approved: boolean; message: string };
      }>('/api/borrower/personal-details', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      setBre(data.bre);

      if (data.bre.approved) {
        setStatus('BRE passed. Redirecting to salary slip upload...');

        setTimeout(() => {
          router.push('/borrower/upload-slip');
        }, 1200);
      } else {
        setStatus(data.bre.message || 'BRE failed.');
      }
    } catch (error: any) {
      setStatus(error.message || 'Failed to submit details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-[1.2fr,_0.8fr]">
        <section className="space-y-6 rounded-[2rem] border border-slate-800/90 bg-slate-950/90 p-10 shadow-soft">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">
              Borrower Journey
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              Step 1: Personal details
            </h1>
            <p className="mt-2 text-slate-400">
              Enter your essential information for the BRE evaluation.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm text-slate-300">Full name</label>
                <Input
                  value={form.fullName}
                  onChange={(event) =>
                    setForm({ ...form, fullName: event.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm text-slate-300">PAN</label>
                <Input
                  value={form.pan}
                  onChange={(event) =>
                    setForm({ ...form, pan: event.target.value.toUpperCase() })
                  }
                  required
                  maxLength={10}
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm text-slate-300">Date of birth</label>
                <Input
                  value={form.dateOfBirth}
                  onChange={(event) =>
                    setForm({ ...form, dateOfBirth: event.target.value })
                  }
                  type="date"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm text-slate-300">Monthly salary</label>
                <Input
                  value={form.monthlySalary}
                  onChange={(event) =>
                    setForm({ ...form, monthlySalary: Number(event.target.value) })
                  }
                  type="number"
                  min={25000}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm text-slate-300">Employment mode</label>
              <select
                value={form.employmentMode}
                onChange={(event) =>
                  setForm({ ...form, employmentMode: event.target.value })
                }
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              >
                {employmentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Checking BRE…' : 'Submit details'}
            </Button>
          </form>

          {bre && (
            <div
              className={`rounded-3xl border p-5 ${
                bre.approved
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-rose-500/50 bg-rose-500/10'
              }`}
            >
              <p className="font-semibold text-white">
                BRE {bre.approved ? 'Passed' : 'Failed'}
              </p>
              <p className="mt-2 text-slate-300">{bre.message}</p>
            </div>
          )}

          {status && <p className="text-sm text-slate-300">{status}</p>}
        </section>

        <aside className="space-y-6 rounded-[2rem] border border-slate-800/90 bg-slate-900/90 p-8 shadow-soft">
          <div>
            <h2 className="text-xl font-semibold text-white">BRE rules</h2>
            <ul className="mt-4 space-y-3 text-slate-300">
              <li>Age must be between 23 and 50 years</li>
              <li>Salary must be at least ₹25,000</li>
              <li>PAN pattern: 5 letters, 4 digits, 1 letter</li>
              <li>Employment mode cannot be Unemployed</li>
            </ul>
          </div>
        </aside>
      </div>

      {status && <Toast message={status} />}
    </main>
  );
}