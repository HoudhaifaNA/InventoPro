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

const primaryClassNames = 'bg-rose-600 text-white fill-white enabled:hover:bg-rose-700 enabled:hover:border-rose-700';
const secondaryClassNames = 'text-rose-600 fill-rose-600 bg-transparent enabled:hover:bg-rose-100';
const lightClassNames = `${secondaryClassNames} border-none`;

const Button = (props: ButtonProps) => {
  const { variant = 'primary', loading, loadingText, icon, iconPosition = 'l', disabled, onClick, children } = props;
  const isChildrenString = typeof children === 'string';

  const classNames = {
    [primaryClassNames]: variant === 'primary',
    [secondaryClassNames]: variant === 'secondary',
    [lightClassNames]: variant === 'light',
    'opacity-60': disabled || loading,
    'min-w-[80px] px-4 py-2': isChildrenString,
    'min-w-[36px] w-9 min-h-[36px] h-9': !isChildrenString,
  };

  const renderIcon = icon && !loading && isChildrenString && <Icon icon={icon} className='h-5 w-5 text-current' />;

  return (
    <button
      className={clsx(
        'flex items-center justify-center gap-2 rounded border border-rose-600  text-sm font-medium  outline-none transition-all disabled:cursor-not-allowed',
        classNames
      )}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {iconPosition === 'l' && renderIcon}
      <span className='flex items-center justify-center gap-2 font-semibold'>
        {loading && isChildrenString && <Icon icon='spinner' className='h-5 w-5 animate-spin text-current' />}
        {loading && loadingText ? loadingText : children}
      </span>
      {iconPosition === 'r' && renderIcon}
    </button>
  );
};

export default Button;
