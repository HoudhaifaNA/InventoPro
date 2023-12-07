import Navigation from '@/app/(application)/Navbar';

export default function ApplicationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  );
}
