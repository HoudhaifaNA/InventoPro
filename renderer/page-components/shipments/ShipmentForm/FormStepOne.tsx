import { useEffect } from 'react';
import useSWR from 'swr';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker, MultiSelect, MultiSelectItem, TextInput, NumberInput } from '@tremor/react';
import { nanoid } from 'nanoid';

import Button from '@/components/Button';
import FormRow from '@/components/FormRow';
import LabeledInput from '@/components/LabeledInput';
import { ProductsList, ShipmentFormInputs } from './types';
import { fetcher } from '@/utils/API';
import { useModals } from '@/store';
import AddProductForm from '@/page-components/products/ProductForm';

const FormStepOne = () => {
  const { addModal } = useModals((state) => state);
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ShipmentFormInputs>();
  const { data } = useSWR<ProductsList>('/products/list', fetcher);

  const [productsList, productsBought] = watch(['productsList', 'productsBought']);

  useEffect(() => {
    const filteredProducts = productsBought.filter((pB) => productsList.indexOf(pB.id) !== -1);

    setValue('productsBought', filteredProducts);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsList, setValue]);

  const onAddModal = () => addModal({ id: nanoid(), title: 'Ajouter un produit', children: AddProductForm });

  return (
    <>
      <FormRow>
        <LabeledInput label="Date d'expédition :" className='flex-1'>
          <Controller
            name='shipmentDate'
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <DatePicker
                  placeholder='Sélectionner une date'
                  enableClear={false}
                  value={value}
                  onValueChange={onChange}
                />
              );
            }}
          />
        </LabeledInput>
        <LabeledInput label='Liste de produits :' className='flex-1'>
          <Controller
            name='productsList'
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <MultiSelect
                  placeholder='Sélectionner...'
                  value={value}
                  onValueChange={onChange}
                  placeholderSearch='Recherche'
                >
                  <Button
                    variant='light'
                    icon='add'
                    className='w-full justify-start rounded-none px-[7px]'
                    onClick={onAddModal}
                  >
                    Ajouter un produit
                  </Button>
                  {data?.products &&
                    data.products.map(({ id, name }) => {
                      return (
                        <MultiSelectItem value={id} key={id}>
                          {name}
                        </MultiSelectItem>
                      );
                    })}
                </MultiSelect>
              );
            }}
          />
        </LabeledInput>
      </FormRow>
      {data?.products &&
        productsList.map((id, ind) => {
          const currProduct = data.products.find((product) => product.id === id);
          if (currProduct) {
            const productError =
              errors.productsBought && errors.productsBought[ind] ? errors.productsBought[ind] : null;

            return (
              <FormRow key={id}>
                <LabeledInput label='Nom du produit :' className='hidden basis-1/2'>
                  <TextInput {...register(`productsBought.${ind}.id`)} value={id} />
                </LabeledInput>
                <LabeledInput label='Nom du produit :' className='basis-1/2'>
                  <TextInput value={currProduct.name} disabled />
                </LabeledInput>
                <LabeledInput
                  id='product-price'
                  label='Prix :'
                  className='flex-1'
                  isError={!!productError?.totalPrice}
                  errorMessage={productError?.totalPrice && productError?.totalPrice.message}
                >
                  <NumberInput
                    {...register(`productsBought.${ind}.totalPrice`, {
                      required: { value: true, message: 'Prix est requis' },
                    })}
                    placeholder='100000'
                    min={0}
                    enableStepper={false}
                  />
                </LabeledInput>
                <LabeledInput
                  id='product-quantity'
                  label='Quantité :'
                  className='flex-1'
                  isError={!!productError?.quantity}
                  errorMessage={productError?.quantity && productError?.quantity.message}
                >
                  <NumberInput
                    {...register(`productsBought.${ind}.quantity`, {
                      required: { value: true, message: 'Quantité est requise' },
                      min: { value: 1, message: 'Quantité minimum 1' },
                    })}
                    placeholder='10'
                    min={0}
                    enableStepper={false}
                  />
                </LabeledInput>
              </FormRow>
            );
          }
        })}
    </>
  );
};

export default FormStepOne;
