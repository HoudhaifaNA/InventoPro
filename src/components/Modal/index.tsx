'use client';
import { ReactNode, useEffect, useState } from 'react';
import clsx from 'clsx';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import useDragger from '@/hooks/useDragger';

interface ModalProps {
  title: string;
  zIndexMultiplier?: number;
  children: ReactNode;
}

const modalStyles = `absolute left-1/2 top-1/2 w-[720px] -translate-x-1/2 -translate-y-1/2 scale-90 overflow-auto rounded-lg bg-white`;

const Modal = ({ title, zIndexMultiplier = 1, children }: ModalProps) => {
  const [signal, toggleSignal] = useState(false);

  const zIndex = 10 * zIndexMultiplier;
  const holderElementId = `holder-${zIndex}`;
  const modalElementId = `modal-${zIndex}`;

  useDragger(modalElementId, holderElementId);

  useEffect(() => {
    const modal = document.getElementById(modalElementId);
    let modalActions = modal ? modal.querySelector('.modal-actions') : null;

    if (modal && modalActions) modal.appendChild(modalActions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (signal) toggleSignal(false);
  }, [signal]);

  return (
    <main className='fixed left-0 top-0 h-screen w-screen !p-0' style={{ zIndex }}>
      <div className='absoulte h-full w-full  bg-black/40' onClick={() => toggleSignal(true)} />
      <div id={modalElementId} className={clsx(modalStyles, signal ? 'animate-closeSignal' : 'animate-popup')}>
        <div
          id={holderElementId}
          className='flex cursor-grab items-center justify-between gap-4 border-b border-neutral-300 px-4 py-2 active:cursor-grabbing '
        >
          <h1 className='truncate text-base font-semibold'>{title}</h1>
          <Button variant='light' squared>
            <Icon icon='close' className='h-5 w-5' />
          </Button>
        </div>
        <div className='p-4'>{children}</div>
      </div>
    </main>
  );
};

export default Modal;
