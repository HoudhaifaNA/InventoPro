import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/Dropdown';
import { useModals } from '@/store';
import { ShipmentWithProducts } from '@/types';
import ConfirmationalForm from '@/components/ConfirmationalForm';
import ShipmentForm from '../ShipmentForm';
import formatUIDate from '@/utils/formatUIDate';

interface ProductActionsProps {
  multipleDisplay?: boolean;
  shipment: ShipmentWithProducts;
}

const ProductActions = ({ shipment }: ProductActionsProps) => {
  const { addModal } = useModals((state) => state);

  const DeleteShipmentModal = () => {
    return (
      <ConfirmationalForm type='d-shipments' ids={shipment.id}>
        Êtes-vous sûr de vouloir supprimer le{' '}
        <b>
          {shipment.shipmentCode || '--'} ({formatUIDate(shipment.shipmentDate)})
        </b>{' '}
        ?
      </ConfirmationalForm>
    );
  };

  const onEditModal = () => {
    addModal({
      id: 'EDIT_SHIPMENT',
      title: 'Modifier une expédition',
      children: ShipmentForm,
      additionalData: shipment,
    });
  };

  const onDeleteModal = () => {
    addModal({
      id: 'DELETE_SHIPMENT',
      title: 'Supprimer une expédition',
      children: DeleteShipmentModal,
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
        <DropdownMenuItem className='flex items-center gap-2 hover:bg-neutral-50' onClick={onDeleteModal}>
          <Icon icon='delete' className='h-4 w-4' />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductActions;
