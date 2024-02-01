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
          <TableHeaderCell className='sticky'>Indice</TableHeaderCell>
          <TableHeaderCell className='sticky'>Nom</TableHeaderCell>
          <TableHeaderCell className='sticky'>Ref</TableHeaderCell>
          <TableHeaderCell className='sticky'>Acheté</TableHeaderCell>
          <TableHeaderCell className='sticky'>Vendu</TableHeaderCell>
          <TableHeaderCell className='sticky'>Stock</TableHeaderCell>
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
