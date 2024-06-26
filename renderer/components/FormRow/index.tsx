import { ReactNode } from 'react';

const FormRow = ({ children }: { children: ReactNode }) => {
  return <div className='group flex items-start gap-4'>{children}</div>;
};
export default FormRow;
