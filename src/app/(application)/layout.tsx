import Navbar from '@/app/(application)/Navbar';

export default function ApplicationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-screen'>
      <Navbar />
      {children}
    </div>
  );
}
