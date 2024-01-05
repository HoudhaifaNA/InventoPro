import { Poppins } from 'next/font/google';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';
import Navbar from '@/layout/Navbar';
import ModalsManager from '@/layout/ModalsManager';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const currentPath = router.asPath;

  return (
    <main className={poppins.className}>
      <NextNProgress color='#00d8d6' />
      <ToastContainer />
      {currentPath.includes('/login') ? (
        <Component {...pageProps} />
      ) : (
        <div className='page-wrapper h-screen '>
          <Navbar />
          <ModalsManager />
          <Component {...pageProps} />
        </div>
      )}
    </main>
  );
}

export default MyApp;
