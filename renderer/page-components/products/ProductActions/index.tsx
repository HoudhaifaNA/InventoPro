import { nanoid } from 'nanoid';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/Dropdown';
import { useDisplay, useModals } from '@/store';
import AddProductForm from '../ProductForm';
import { ProductsWithShipment } from '@/types';
import ConfirmationalForm from '@/components/ConfirmationalForm';
import SaleForm from '@/page-components/sales/SaleForm';

interface ProductActionsProps {
  multipleDisplay?: boolean;
  product: ProductsWithShipment;
}

const ProductActions = ({ product, multipleDisplay }: ProductActionsProps) => {
  const { addModal } = useModals((state) => state);
  const display = useDisplay((state) => state.display);

  const isGridDisplay = display === 'grid' && multipleDisplay;

  const DeleteProductModal = () => {
    return (
      <ConfirmationalForm type='d-products' ids={product.id}>
        Êtes-vous sûr de vouloir supprimer le <b> {product.name} </b> ?
      </ConfirmationalForm>
    );
  };

  const onEditModal = () => {
    addModal({ id: 'EDIT_PRODUCT', title: 'Modifier un produit', children: AddProductForm, additionalData: product });
  };

  const onSaleModal = () => {
    addModal({ id: nanoid(), title: 'Vendre un produit', children: SaleForm, additionalData: product });
  };

  const onDeleteModal = () => {
    addModal({
      id: 'DELETE_PRODUCT',
      title: 'Supprimer un produit',
      children: DeleteProductModal,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='outline-none'>
        <div>
          <Button variant='light' className='w-full' squared={!isGridDisplay}>
            {isGridDisplay ? 'Plus' : <Icon icon='more_horiz' className='h-5 w-5' />}
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-white'>
        <DropdownMenuItem className='flex items-center gap-2 hover:bg-neutral-50' onClick={onSaleModal}>
          <Icon icon='sales' className='h-4 w-4' />
          Vendre
        </DropdownMenuItem>
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
