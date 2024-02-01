import Button from '@/components/Button';
import { useModals } from '@/store';
import API from '@/utils/API';
import notify from '@/utils/notify';
import redirectPath from '@/utils/redirectPath';
import { isAxiosError } from 'axios';

const LogoutModal = () => {
  const { deleteModal } = useModals();

  const onLogout = async () => {
    try {
      const message = 'Vous vous êtes déconnecté avec succès.';

      await API.post(`/users/logout`);
      notify('success', message);
      deleteModal(2);
      redirectPath('/login');
    } catch (err: any) {
      console.log(err);

      let message = 'Error';
      if (isAxiosError(err)) {
        message = err.response?.data.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      notify('error', message);
    }
  };

  return (
    <div className='min-h-[40px]'>
      <div>
        <p className='text-base font-medium'>Voulez-vous vous déconnecter ?</p>
      </div>
      <div className='modal-actions flex w-full items-center justify-end gap-4 border-t border-neutral-300 bg-white p-4'>
        <Button onClick={onLogout}>Déconnecter</Button>
      </div>
    </div>
  );
};

export default LogoutModal;
