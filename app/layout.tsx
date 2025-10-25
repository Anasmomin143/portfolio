import { ReactNode } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

type Props = {
  children: ReactNode;
};

export const metadata = {
  title: 'Portfolio',
  description: 'Personal Portfolio',
};

export default function RootLayout({ children }: Props) {
  return (
    <html suppressHydrationWarning>
      <body className="min-h-screen">
        {children}
        <Toaster position="top-center" richColors duration={3000} expand={false} />
      </body>
    </html>
  );
}