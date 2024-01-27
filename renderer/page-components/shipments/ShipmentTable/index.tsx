import clsx from 'clsx';
import { Badge, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { ShipmentWithProducts } from 'types';
import formatUIDate from '@/utils/formatUIDate';
import ProductActions from '../ShipmentActions';
import formatFiatValue from '@/utils/formatFiatValue';
import TABLE_HEADER_CELLS from './constants';
import TableCellSorter from '@/components/TableCellSorter';
import { useModals, useResources } from '@/store';
import ConfirmationalForm from '@/components/ConfirmationalForm';

interface ShipmentsTableProps {
  shipments: ShipmentWithProducts[];
}

const ShipmentsTable = ({ shipments }: ShipmentsTableProps) => {
  const { selectItem, shipments: shipmentsRes } = useResources((state) => state);
  const { addModal } = useModals((state) => state);

  const DeleteShipmentsModal = () => {
    return (
      <ConfirmationalForm type='d-shipments' ids={shipmentsRes.selectedItems.join(',')}>
        Êtes-vous sûr de vouloir supprimer <b> {shipmentsRes.selectedItems.length} expéditions</b> ?
      </ConfirmationalForm>
    );
  };

  const onDeleteModal = () => {
    if (shipmentsRes.selectedItems.length > 0) {
      addModal({
        id: 'DELETE_PRODUCT',
        title: 'Supprimer des expéditions',
        children: DeleteShipmentsModal,
      });
    }
  };

  return (
    <Table className='h-full bg-white pb-8'>
      <TableHead>
        <TableRow>
          <TableHeaderCell className='sticky'>Indice</TableHeaderCell>
          {TABLE_HEADER_CELLS.map((cell) => {
            return <TableCellSorter {...cell} resource='shipments' key={cell.title} />;
          })}
          <TableHeaderCell className='sticky'>
            <Button variant='light' squared onClick={onDeleteModal}>
              <Icon icon='delete' className='h-5 w-5' />
            </Button>
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {shipments.map((shipment, ind) => {
          const { id, shipmentDate, arrivalDate, total, productsCount, shipmentCode } = shipment;
          const isSelected = shipmentsRes.selectedItems.indexOf(id) !== -1;

          return (
            <TableRow
              className={clsx('transition-colors', isSelected ? 'bg-indigo-700 text-white' : '')}
              key={id}
              onClick={(e) => {
                e.preventDefault();
                if (e.ctrlKey) {
                  selectItem('shipments', id);
                }
              }}
            >
              <TableCell>{ind + 1} </TableCell>
              <TableCell>{shipmentCode || '--'}</TableCell>
              <TableCell>{formatUIDate(shipmentDate)}</TableCell>
              <TableCell>{productsCount}</TableCell>
              <TableCell>{formatFiatValue(total)}</TableCell>
              <TableCell>
                <Badge size='xs' className={clsx(arrivalDate ? 'bg-green-200' : 'bg-orange-200')}>
                  <span className={clsx('text-xs', arrivalDate ? 'text-green-600' : 'text-orange-600')}>
                    {arrivalDate ? 'Arrivé' : 'En route'}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>{formatUIDate(arrivalDate)}</TableCell>
              <TableCell>
                <ProductActions shipment={shipment} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ShipmentsTable;
