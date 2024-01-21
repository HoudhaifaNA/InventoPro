/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { Select, SelectItem } from '@tremor/react';

import { useProductsUrl } from '@/store';
import Icon from '@/components/Icon';
import Button from '@/components/Button';

const LIMITS = [100, 200, 300, 400, 500];

const Pagination = ({ results }: { results: number }) => {
  const { queries, addQuery } = useProductsUrl((state) => state);
  const page = queries.page ? Number(queries.page) : 1;
  const limit = queries.limit ? Number(queries.limit) : 5;

  const lastPage = Math.ceil(results / limit);
  const firstRowNum = (page - 1) * limit + 1;
  const lastRowNum = page === lastPage ? results : page * limit;
  const isFirstPage = page === 1;
  const isLastPage = page === lastPage;

  const setPage = (page: number) => {
    addQuery({ query: 'page', value: page });
  };

  const setRows = (rows: number) => {
    addQuery({ query: 'limit', value: rows });
  };

  const onOptionClick = (option: string) => {
    setRows(Number(option));
  };

  useEffect(() => {
    if (limit * (page - 1) > results) setPage(1);
  }, [results, page, limit]);

  const goToFirstPage = () => !isFirstPage && setPage(1);
  const goToPrevPage = () => !isFirstPage && setPage(page - 1);
  const goToNextPage = () => !isLastPage && setPage(page + 1);
  const goToLastPage = () => !isLastPage && setPage(lastPage);

  return (
    <div className='flex h-16 w-full items-center justify-end gap-4 '>
      <div className='flex items-center gap-4'>
        <span className='text-nowrap text-sm font-medium'>Lignes par page</span>
        <Select defaultValue={limit.toString()} onValueChange={onOptionClick} enableClear={false}>
          {LIMITS.map((limit) => {
            return (
              <SelectItem value={limit.toString()} key={limit}>
                {limit}
              </SelectItem>
            );
          })}
        </Select>
      </div>
      <span className='text-nowrap text-sm font-medium'>
        {firstRowNum}-{lastRowNum} sur {results}
      </span>
      <div className='flex items-center justify-end gap-2'>
        <Button squared variant='light' onClick={goToFirstPage}>
          <Icon icon='first_page' className='h-5 w-5 cursor-pointer' />
        </Button>
        <Button squared variant='light' onClick={goToPrevPage}>
          <Icon icon='back' className='h-5 w-5 cursor-pointer' />
        </Button>
        <span className='text-nowrap text-sm font-medium'>
          {page} sur {lastPage} {lastPage > 1 ? 'pages' : 'page'}
        </span>
        <Button squared variant='light' onClick={goToNextPage}>
          <Icon icon='next' className='h-5 w-5 cursor-pointer' />
        </Button>
        <Button squared variant='light' onClick={goToLastPage}>
          <Icon icon='last_page' className='h-5 w-5 cursor-pointer' />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
