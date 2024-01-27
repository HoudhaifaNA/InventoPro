import clsx from 'clsx';
import { Badge, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { SalesWithProduct } from 'types';
import formatUIDate from '@/utils/formatUIDate';
import SalesActions from '../SalesActions';
import formatFiatValue from '@/utils/formatFiatValue';
import TABLE_HEADER_CELLS from './constants';
import TableCellSorter from '@/components/TableCellSorter';
import { useModals, useResources } from '@/store';
import ConfirmationalForm from '@/components/ConfirmationalForm';

interface SalesTableProps {
  sales: SalesWithProduct[];
}

const SalesTable = ({ sales }: SalesTableProps) => {
  const { addModal } = useModals((state) => state);
  const { selectItem, sales: salesRes } = useResources((state) => state);

  const DeleteSalesModal = () => {
    return (
      <ConfirmationalForm type='cancel-sale' ids={salesRes.selectedItems.join(',')}>
        Êtes-vous sûr de vouloir annuler <b> {salesRes.selectedItems.length} ventes</b> ?
      </ConfirmationalForm>
    );
  };

  const onCancelModal = () => {
    if (salesRes.selectedItems.length > 0) {
      addModal({
        id: 'CANCEL_SALE',
        title: 'Supprimer des ventes',
        children: DeleteSalesModal,
      });
    }
  };
  return (
    <Table className='h-full bg-white pb-8'>
      <TableHead>
        <TableRow>
          <TableHeaderCell className='sticky'>Indice</TableHeaderCell>
          <TableHeaderCell className='sticky'>Produit</TableHeaderCell>
          <TableHeaderCell className='sticky'>Référence</TableHeaderCell>
          {TABLE_HEADER_CELLS.map((cell) => {
            return <TableCellSorter {...cell} resource='sales' key={cell.field} />;
          })}
          <TableHeaderCell className='sticky'>
            <Button variant='light' squared onClick={onCancelModal}>
              <Icon icon='delete' className='h-5 w-5' />
            </Button>
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sales.map((sale, ind) => {
          const { id, price, quantity, type, soldAt, total, product } = sale;
          const isSelected = salesRes.selectedItems.indexOf(id) !== -1;

          return (
            <TableRow
              className={clsx('transition-colors', isSelected ? 'bg-indigo-700 text-white' : '')}
              key={id}
              onClick={(e) => {
                e.preventDefault();
                if (e.ctrlKey) {
                  selectItem('sales', id);
                }
              }}
            >
              <TableCell>{ind + 1} </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.reference || '--'}</TableCell>
              <TableCell>{quantity}</TableCell>
              <TableCell>{formatFiatValue(price)}</TableCell>
              <TableCell>{formatFiatValue(total)}</TableCell>
              <TableCell>
                <Badge size='xs' className={clsx(type === 'retail' ? 'bg-green-200' : 'bg-orange-200')}>
                  <span className={clsx('text-xs', type === 'retail' ? 'text-green-600' : 'text-orange-600')}>
                    {type === 'retail' ? 'Details' : 'Gros'}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>{formatUIDate(soldAt)}</TableCell>
              <TableCell>
                <SalesActions sale={sale} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default SalesTable;
