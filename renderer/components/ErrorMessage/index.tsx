import { AxiosError } from 'axios';
import Image from 'next/image';

interface ErrorMessageProps {
  error: any;
}
const ErrorMessage = ({ error }: ErrorMessageProps) => {
  let message = 'Erreur du serveur';

  if (error instanceof AxiosError) {
    message = error.response?.data.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className='flex h-full flex-col items-center justify-center gap-6 text-center'>
      <Image src='/images/error.png' width={320} height={320} alt='error' />
      <h4 className='text-1xl font-semibold text-red-600'>{message}</h4>
    </div>
  );
};

export default ErrorMessage;
