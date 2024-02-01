import Poppins from 'next/font/local';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css';
import ApplicationLayout from '@/layout/layout';

const poppins = Poppins({
  src: [
    { path: '../public/font/Poppins-Regular.ttf', weight: '400' },
    { path: '../public/font/Poppins-Medium.ttf', weight: '500' },
    { path: '../public/font/Poppins-Semibold.ttf', weight: '600' },
    { path: '../public/font/Poppins-Bold.ttf', weight: '700' },
    { path: '../public/font/Poppins-ExtraBold.ttf', weight: '800' },
    { path: '../public/font/Poppins-Italic.ttf', weight: '400', style: 'italic' },
    { path: '../public/font/Poppins-MediumItalic.ttf', weight: '500', style: 'italic' },
    { path: '../public/font/Poppins-SemiboldItalic.ttf', weight: '600', style: 'italic' },
    { path: '../public/font/Poppins-BoldItalic.ttf', weight: '700', style: 'italic' },
    { path: '../public/font/Poppins-ExtraBoldItalic.ttf', weight: '800', style: 'italic' },
  ],
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
        <ApplicationLayout>
          <Component {...pageProps} />
        </ApplicationLayout>
      )}
    </main>
  );
}

export default MyApp;
