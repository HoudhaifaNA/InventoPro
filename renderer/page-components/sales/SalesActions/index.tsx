import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/Dropdown';
import { useModals } from '@/store';
import { SalesWithProduct } from '@/types';
import ConfirmationalForm from '@/components/ConfirmationalForm';
import SaleForm from '../SaleForm';

interface ProductActionsProps {
  multipleDisplay?: boolean;
  sale: SalesWithProduct;
}

const SalesActions = ({ sale }: ProductActionsProps) => {
  const { addModal } = useModals((state) => state);

  const CancelSaleModal = () => {
    return (
      <ConfirmationalForm type='cancel-sale' ids={sale.id}>
        Êtes-vous sûr de vouloir annuler la vente{' '}
        <b>
          {sale.product.name} {sale.product.reference || '--'}
        </b>{' '}
        ?
      </ConfirmationalForm>
    );
  };

  const onEditModal = () => {
    addModal({
      id: 'EDIT_SALE',
      title: 'Modifier une vente',
      children: SaleForm,
      additionalData: sale,
    });
  };

  const onCancelModal = () => {
    addModal({
      id: 'CANCEL_SALE',
      title: 'Annule la vente',
      children: CancelSaleModal,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='outline-none'>
        <div>
          <Button variant='light' className='w-full' squared>
            <Icon icon='more_horiz' className='h-5 w-5' />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-white'>
        <DropdownMenuItem className='flex items-center gap-2 hover:bg-neutral-50' onClick={onEditModal}>
          <Icon icon='edit' className='h-4 w-4' />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuItem className='flex items-center gap-2 hover:bg-neutral-50' onClick={onCancelModal}>
          <Icon icon='delete' className='h-4 w-4' />
          Annuler
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SalesActions;
