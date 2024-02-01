import { useState } from 'react';
import { TextInput, SearchSelect, SearchSelectItem } from '@tremor/react';
import { Controller, FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';

import Button from '@/components/Button';
import LabeledInput from '@/components/LabeledInput';

interface SelectTextInputProps<T> {
  label: string;
  name: Path<T>;
  placeholder: string;
  options: string[];
}

const SelectTextInput = <T extends FieldValues>({ label, name, placeholder, options }: SelectTextInputProps<T>) => {
  const { control, register, setValue } = useFormContext<T>();
  const [isNewItem, setItemStatus] = useState(!Boolean(options.length));

  const toggleType = () => {
    setItemStatus(!isNewItem);

    isNewItem && setValue(name, '' as PathValue<T, Path<T>>);
  };

  const renderInput = () => {
    if (isNewItem) {
      return <TextInput placeholder={placeholder} {...register(name)} />;
    } else {
      return (
        <Controller
          name={name}
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <SearchSelect placeholder='Sélectionner...' value={value} onValueChange={onChange}>
                {options.map((option) => {
                  return (
                    <SearchSelectItem value={option} key={option}>
                      {option}
                    </SearchSelectItem>
                  );
                })}
              </SearchSelect>
            );
          }}
        />
      );
    }
  };

  const addionalLabel = (
    <Button variant='light' onClick={toggleType} className='p-0'>
      {isNewItem ? 'Inscrite' : 'Nouveau'}
    </Button>
  );

  return (
    <LabeledInput label={label} className='flex-1' additionalLabel={addionalLabel}>
      {renderInput()}
    </LabeledInput>
  );
};

export default SelectTextInput;
