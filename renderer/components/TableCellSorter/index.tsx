import { TableHeaderCell } from '@tremor/react';
import clsx from 'clsx';

import useResources, { ResourcesNames } from '@/store/useResources';
import Icon from 'components/Icon';

interface TableHeaderProps {
  title: string;
  field: string;
  resource: ResourcesNames;
}

const TableCellSorter = ({ title, field, resource }: TableHeaderProps) => {
  const resourcesState = useResources((state) => state);
  const { addQuery } = resourcesState;

  const { orderBy } = resourcesState[resource].queries;

  const isDescending = `-${field}` === orderBy;

  let queryValue = field;
  if (orderBy === field) queryValue = `-${field}`;

  const toggleSorting = () => {
    addQuery(resource, { query: 'orderBy', value: queryValue });
  };

  return (
    <TableHeaderCell key={title} onClick={toggleSorting} className='sticky cursor-pointer'>
      <div className='flex items-center gap-1'>
        {title}
        <Icon icon='expand' className={clsx('h-5 w-5 transition-transform', isDescending && 'rotate-180')} />
      </div>
    </TableHeaderCell>
  );
};

export default TableCellSorter;
