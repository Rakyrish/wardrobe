import TawkWidget from '../component/TawkWidget';
import { Geist, Geist_Mono } from 'next/font/google';
import Header from './layout/header/page';
import Footer from './layout/footer/page';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
        <Header />
        <div className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
          {children}
          <ToastContainer />
        </div>
        <Footer />
        {/* Load Tawk.to widget */}
        <TawkWidget />
      </body>
    </html>
  );
}