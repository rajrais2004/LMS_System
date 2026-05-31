import type { Metadata } from 'next';
import './globals.css';
import { Header } from '../components/ui/header';

export const metadata: Metadata = {
  title: 'Loan Management System',
  description: 'A polished loan management assignment system.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
