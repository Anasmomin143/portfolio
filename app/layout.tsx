import { ReactNode } from 'react';
import './globals.css';

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
      </body>
    </html>
  );
}