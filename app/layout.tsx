import TawkWidget from '../component/TawkWidget';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

// Load Geist and Geist_Mono with error handling
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // Fallback to system fonts during loading
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
          {children}
        </div>
        <TawkWidget />
      </body>
    </html>
  );
}