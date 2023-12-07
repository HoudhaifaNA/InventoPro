import Image from 'next/image';

import LoginForm from '@/app/LoginForm';

export default function Home() {
  return (
    <main className='max-w-screen relative flex min-h-screen  items-center justify-between bg-gradient-to-bl	from-indigo-500 to-indigo-900 p-4 md:h-screen'>
      <div>
        <Image
          className='hidden md:block'
          src='/login-illustration.png'
          width={632}
          height={632}
          alt='Login illustration'
        />
      </div>
      <LoginForm />
    </main>
  );
}
