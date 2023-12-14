import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import clsx from 'clsx';

import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Login | InventoPro',
  description: 'Login page',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={clsx('overflow-y-hidden', poppins.className)}>{children}</body>
    </html>
  );
}
