import Navbar from './Navbar';
import ModalsManager from './ModalsManager';
import useInactiveTimeout from '@/hooks/useInactiveTimeout';

export default function ApplicationLayout({ children }: { children: React.ReactNode }) {
  useInactiveTimeout();

  return (
    <div className='page-wrapper h-screen'>
      <Navbar />
      <ModalsManager />
      {children}
    </div>
  );
}
