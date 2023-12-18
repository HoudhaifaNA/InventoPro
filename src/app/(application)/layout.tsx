import Navbar from '@/app/(application)/Navbar';
import ModalsManager from './ModalsManager';

export default function ApplicationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='page-wrapper h-screen'>
      <Navbar />
      <ModalsManager />
      {children}
    </div>
  );
}
