import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { AuthProvider } from '@/components/authProvider/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'INSCALE',
  description: 'Assignment created by Aleksandar',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AuthProvider>
          <div className='container'>
            <div className='wrapper'>
              <Navbar />
              {children}
              <Footer />
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
