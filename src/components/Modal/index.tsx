import { ReactNode, useEffect, useState } from 'react';
import clsx from 'clsx';

import Button from '@/components/Button';
import Icon from '@/components/Icon';

interface ModalProps {
  title: string;
  zIndexMultiplier: number;
  children: ReactNode;
}

const Modal = ({ title, zIndexMultiplier, children }: ModalProps) => {
  const [signal, toggleSignal] = useState(false);

  const zIndex = 10 * zIndexMultiplier;

  useEffect(() => {
    if (signal) toggleSignal(false);
  }, [signal]);

  const modalStyles = `absolute left-1/2 top-1/2 h-[480px] w-[720px] -translate-x-1/2 -translate-y-1/2 scale-90 overflow-auto rounded-lg bg-white`;

  return (
    <main className={`fixed left-0 top-0 h-screen w-screen !p-0`} style={{ zIndex }}>
      <div className='absoulte h-full w-full bg-black/40' onClick={() => toggleSignal(true)} />
      <div className={clsx(modalStyles, signal ? 'animate-closeSignal' : 'animate-popup')}>
        <div className='flex items-center justify-between gap-4 border-b border-neutral-300 px-4 py-2 '>
          <h1 className='truncate text-base font-semibold'>{title}</h1>
          <Button variant='light'>
            <Icon icon='close' className='h-5 w-5' />
          </Button>
        </div>
        <div className='p-4'>{children}</div>
      </div>
    </main>
  );
};

export default Modal;
