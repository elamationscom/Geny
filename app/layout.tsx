import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Geny – Social AI Scheduler',
  description: 'Simplest way to schedule social posts with AI',
};

export const viewport: Viewport = {
  themeColor: '#4a6cff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 bg-mesh text-white antialiased">{children}</body>
    </html>
  );
}

