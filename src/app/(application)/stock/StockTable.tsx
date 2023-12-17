import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react';

const PLACEHOLDERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const StockTable = () => {
  return (
    <Table className='h-full bg-white pb-8'>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Indice</TableHeaderCell>
          <TableHeaderCell>Nom</TableHeaderCell>
          <TableHeaderCell>Ref</TableHeaderCell>
          <TableHeaderCell>Achete</TableHeaderCell>
          <TableHeaderCell>Sold</TableHeaderCell>
          <TableHeaderCell>Stock</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {PLACEHOLDERS.map((el) => {
          return (
            <TableRow key={el}>
              <TableCell>{el} </TableCell>
              <TableCell>Produit {el}</TableCell>
              <TableCell>#65FYAA</TableCell>
              <TableCell>2022</TableCell>
              <TableCell>4605</TableCell>
              <TableCell>456</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default StockTable;
