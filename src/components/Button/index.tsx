'use client';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

import Icon from '@/components/Icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'light';
  loading?: boolean;
  icon?: string;
  iconPosition?: 'r' | 'l';
  loadingText?: string;
  disabled?: boolean;
  children: ReactNode;
}

const secondaryClassNames = 'text-slate-800 bg-transparent enabled:hover:bg-slate-100';
const lightClassNames = `${secondaryClassNames} border-none`;

const Button = (props: ButtonProps) => {
  const { variant = 'primary', loading, loadingText, icon, iconPosition = 'l', disabled, onClick, children } = props;

  const classNames = {
    [secondaryClassNames]: variant === 'secondary',
    [lightClassNames]: variant === 'light',
    'opacity-60': disabled || loading,
  };

  const renderIcon = icon && !loading && <Icon icon={icon} className='h-5 w-5 text-current' />;

  return (
    <button
      className={clsx(
        'flex min-w-[80px] items-center	gap-2 rounded border border-slate-800 bg-slate-800 px-4 py-2 text-sm font-medium text-white outline-none transition-all  enabled:hover:bg-slate-900 disabled:cursor-not-allowed',
        classNames
      )}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <Icon icon='spinner' className='h-5 w-5 animate-spin text-current' />}
      {iconPosition === 'l' && renderIcon}
      {loading && loadingText ? loadingText : children}
      {iconPosition === 'r' && renderIcon}
    </button>
  );
};

export default Button;
