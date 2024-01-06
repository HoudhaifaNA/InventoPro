import { useEffect, useState } from 'react';
import { TextInput } from '@tremor/react';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import Switcher, { Option } from '@/components/Switcher';
import { useDisplay, useProductsUrl } from '@/store';

const optionsList: Option<'list' | 'grid'>[] = [
  { payload: 'list', icon: 'list_view' },
  { payload: 'grid', icon: 'grid_view' },
];

const Header = () => {
  const { display, updateDisplayType } = useDisplay((state) => state);
  const { addQuery, deleteQuery } = useProductsUrl((state) => state);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (searchQuery.trim()) {
      addQuery({ query: 'q', value: searchQuery });
    } else {
      deleteQuery('q');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <div className='flex items-center gap-6 py-4'>
      <div className='flex flex-1 items-center gap-2'>
        <TextInput
          className='pl-2'
          type='text'
          placeholder='Recherche...'
          value={searchQuery}
          icon={() => <Icon icon='search' className='h-5 w-5 opacity-60' />}
          onValueChange={setSearchQuery}
        />
        <Switcher<'list' | 'grid'>
          options={optionsList}
          defaultValue={display}
          squared
          handleSelect={(payload) => updateDisplayType(payload)}
        />
      </div>
      <Button>Ajouter un produit</Button>
    </div>
  );
};

export default Header;
