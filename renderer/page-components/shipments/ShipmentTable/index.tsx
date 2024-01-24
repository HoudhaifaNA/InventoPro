import { Badge, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { ShipmentSelect } from 'types';
import formatUIDate from '@/utils/formatUIDate';

interface ShipmentsTableProps {
  shipments: ShipmentSelect[];
}

const ShipmentsTable = ({ shipments }: ShipmentsTableProps) => {
  return (
    <Table className='h-full bg-white pb-8'>
      <TableHead>
        <TableRow>
          <TableHeaderCell>
            <input type='checkbox' />
          </TableHeaderCell>
          <TableHeaderCell>Indice</TableHeaderCell>
          <TableHeaderCell>ID</TableHeaderCell>
          <TableHeaderCell>Date d&apos;expédition</TableHeaderCell>
          <TableHeaderCell>Produits</TableHeaderCell>
          <TableHeaderCell>Dépenses</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Date d&apos;arrivée</TableHeaderCell>
          <TableHeaderCell>
            <Button variant='light'>
              <Icon icon='more_horiz' className='h-5 w-5' />
            </Button>
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {shipments.map((shipment, ind) => {
          const { id, shipmentDate, arrivalDate, total, productsCount, shipmentCode } = shipment;
          return (
            <TableRow key={id}>
              <TableCell>
                <input type='checkbox' />
              </TableCell>
              <TableCell>{ind + 1} </TableCell>
              <TableCell>{shipmentCode || '--'}</TableCell>
              <TableCell>{formatUIDate(shipmentDate)}</TableCell>
              <TableCell>{productsCount}</TableCell>
              <TableCell>{total}.00 DA</TableCell>
              <TableCell>
                <Badge size='xs'>
                  <span className='text-xs'>{arrivalDate ? 'Arrived' : 'In way'}</span>
                </Badge>
              </TableCell>
              <TableCell>{formatUIDate(arrivalDate)}</TableCell>
              <TableCell>
                <Button variant='light'>
                  <Icon icon='more_horiz' className='h-5 w-5' />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ShipmentsTable;
