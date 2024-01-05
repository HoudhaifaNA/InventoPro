import { toast } from 'react-toastify';

type NotificationType = 'success' | 'warn' | 'error' | 'info';

const notify = (type: NotificationType, message: string) => {
  toast[type](<span className='text-sm font-medium'>{message}</span>, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });
};

export default notify;
