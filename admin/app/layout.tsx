import './globals.css';
import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RiseBet Admin',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark antialiased min-h-screen">
      <body className="bg-background min-h-screen antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              style: {
                background: '#1a2332',
                color: '#FFD700',
                border: '1px solid #D4AF37',
              },
            },
            error: {
              style: {
                background: '#1a2332',
                color: '#ef4444',
                border: '1px solid #ef4444',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
