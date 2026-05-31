import Link from 'next/link';

const modules = [
  { href: '/auth/login', label: 'Borrower Login' },
  { href: '/auth/register', label: 'Borrower Register' },
  { href: '/dashboard/admin', label: 'Admin Dashboard' },
  { href: '/dashboard/sales', label: 'Sales Dashboard' },
  { href: '/dashboard/sanction', label: 'Sanction Dashboard' },
  { href: '/dashboard/disbursement', label: 'Disbursement Dashboard' },
  { href: '/dashboard/collection', label: 'Collection Dashboard' },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-16">
      <section className="rounded-3xl border border-slate-800/90 bg-slate-900/80 p-10 shadow-soft backdrop-blur-md">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">Loan Management System</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Premium borrower and operations workflow</h1>
            <p className="mt-4 max-w-2xl text-slate-300">Built for evaluators: clean dashboards, strong RBAC, audit trails, and a guided borrower loan flow with intelligent BRE checks.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-2xl border border-slate-800/90 bg-slate-950/80 px-5 py-4 text-left transition hover:border-cyan-400/50 hover:bg-slate-900/90">
                <p className="text-sm text-slate-400">{item.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
