import { ComponentPropsWithoutRef, ReactElement, cloneElement } from 'react';
import clsx from 'clsx';

interface LabeledInputProps extends Pick<ComponentPropsWithoutRef<'div'>, 'className'> {
  id?: string;
  label: string;
  color?: 'white' | 'black';
  isError?: boolean;
  errorMessage?: string;
  additionalLabel?: ReactElement | JSX.Element;
  children: ReactElement | JSX.Element;
}

const LabeledInput = ({
  id,
  label,
  color = 'black',
  isError,
  errorMessage,
  className,
  additionalLabel,
  children,
}: LabeledInputProps) => {
  const clonedChildren = cloneElement(children, { id });

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={clsx(
          'mb-2 flex items-center gap-1 text-sm font-medium',
          color === 'white' ? 'text-white' : 'text-black'
        )}
      >
        <span>{label}</span>
        {additionalLabel}
      </label>
      {clonedChildren}
      {isError && errorMessage && <span className='mt-1 text-xs font-medium text-red-500'>{errorMessage}</span>}
    </div>
  );
};

export default LabeledInput;
