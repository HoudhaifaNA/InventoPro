import { ComponentPropsWithoutRef } from 'react';

interface IconProps extends ComponentPropsWithoutRef<'svg'> {
  icon: string;
}

const Icon = ({ icon, className }: IconProps) => {
  return (
    <svg className={className}>
      <use xlinkHref={`/sprite.svg#${icon}`} />
    </svg>
  );
};

export default Icon;
