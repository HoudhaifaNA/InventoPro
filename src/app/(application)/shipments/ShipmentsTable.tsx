import { Badge, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react';

import Button from '@/components/Button';
import Icon from '@/components/Icon';

const PLACEHOLDERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const ShipmentsTable = () => {
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
        {PLACEHOLDERS.map((el) => {
          return (
            <TableRow key={el}>
              <TableCell>
                <input type='checkbox' />
              </TableCell>
              <TableCell>{el} </TableCell>
              <TableCell>EXP-454516XS9946</TableCell>
              <TableCell>14-07-2022</TableCell>
              <TableCell>4</TableCell>
              <TableCell>458900.00 DA</TableCell>
              <TableCell>
                <Badge size='xs'>
                  <span className='text-xs'>En rupture de stock</span>
                </Badge>
              </TableCell>
              <TableCell>23-04-2023</TableCell>
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
