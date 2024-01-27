import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react';

import { GetStock } from '@/types';

interface StockTableProps {
  stock: GetStock['stock'];
}

const StockTable = ({ stock }: StockTableProps) => {
  return (
    <Table className='h-full bg-white pb-8'>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Indice</TableHeaderCell>
          <TableHeaderCell>Nom</TableHeaderCell>
          <TableHeaderCell>Ref</TableHeaderCell>
          <TableHeaderCell>Acheté</TableHeaderCell>
          <TableHeaderCell>Vendu</TableHeaderCell>
          <TableHeaderCell>Stock</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {stock.map((product, ind) => {
          const { id, name, reference, bought, sold, stock } = product;
          return (
            <TableRow key={id}>
              <TableCell>{ind + 1} </TableCell>
              <TableCell>{name}</TableCell>
              <TableCell>{reference || '--'}</TableCell>
              <TableCell>{bought}</TableCell>
              <TableCell>{sold}</TableCell>
              <TableCell>{stock}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default StockTable;
