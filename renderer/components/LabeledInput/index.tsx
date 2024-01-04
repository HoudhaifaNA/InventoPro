import { ComponentPropsWithoutRef, ReactElement, cloneElement } from 'react';
import clsx from 'clsx';

interface LabeledInputProps extends Pick<ComponentPropsWithoutRef<'div'>, 'className'> {
  id?: string;
  label: string;
  color?: 'white' | 'black';
  children: ReactElement | JSX.Element;
}

const LabeledInput = ({ id, label, color = 'black', className, children }: LabeledInputProps) => {
  const clonedChildren = cloneElement(children, { id });

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={clsx('mb-2 inline-block text-sm font-medium', color === 'white' ? 'text-white' : 'text-black')}
      >
        {label}
      </label>
      {clonedChildren}
    </div>
  );
};

export default LabeledInput;
