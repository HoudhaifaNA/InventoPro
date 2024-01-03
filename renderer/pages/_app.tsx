// import { Poppins } from 'next/font/google';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';

import '../styles/globals.css';
import Navbar from '@/layout/Navbar';
import ModalsManager from '@/layout/ModalsManager';

// const poppins = Poppins({
//   subsets: ['latin'],
//   weight: ['300', '600', '700', '800'],
// });

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const currentPath = router.asPath;

  return (
    <>
      {currentPath.includes('/login') ? (
        <Component {...pageProps} />
      ) : (
        <div className={`page-wrapper h-screen`}>
          <Navbar />
          <ModalsManager />
          <Component {...pageProps} />
        </div>
      )}
    </>
  );
}

export default MyApp;
