'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { Toast } from '../../../components/ui/toast';

export default function UploadSlipPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setStatus('Please upload a salary slip first.');
      return;
    }
    setLoading(true);
    setStatus('');
    try {
      const formData = new FormData();
      formData.append('slip', file);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/api/borrower/upload-slip`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Upload failed');
      setStatus('Salary slip uploaded. Continue to loan application.');
      router.push('/borrower/apply-loan');
    } catch (error: any) {
      setStatus(error.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <section className="rounded-[2rem] border border-slate-800/90 bg-slate-950/90 p-10 shadow-soft">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Step 2</p>
          <h1 className="text-3xl font-semibold text-white">Upload salary slip</h1>
          <p className="text-slate-400">Only PDF, JPG, or PNG files are accepted, up to 5MB.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <label className="block text-sm text-slate-300">Choose salary slip</label>
            <input type="file" accept="application/pdf,image/jpeg,image/png" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100" />
          </div>
          <Button type="submit" disabled={!file || loading}>{loading ? 'Uploading…' : 'Upload slip'}</Button>
        </form>
        {status && <p className="mt-4 text-sm text-slate-300">{status}</p>}
      </section>
      {status && <Toast message={status} />}
    </main>
  );
}
