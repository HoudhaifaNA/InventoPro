import Image from 'next/image';

import LoginForm from '@/page-components/login/LoginForm';

export default function LoginPage() {
  return (
    <main className='max-w-screen relative flex min-h-screen items-center justify-between bg-gradient-to-bl	from-indigo-500 to-indigo-900 p-4'>
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
