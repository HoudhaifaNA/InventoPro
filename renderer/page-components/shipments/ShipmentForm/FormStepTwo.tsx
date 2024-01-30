/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker, MultiSelect, MultiSelectItem, TextInput, NumberInput, Divider } from '@tremor/react';
import { nanoid } from 'nanoid';

import Button from '@/components/Button';
import FormRow from '@/components/FormRow';
import LabeledInput from '@/components/LabeledInput';
import { ProductsList, ShipmentFormInputs } from './types';
import { fetcher } from '@/utils/API';
import { useModals } from '@/store';
import AddProductForm from '@/page-components/products/ProductForm';
import { calculateExpensesTotal, calculateShipmentTotal } from '@/utils/calculations';

const FormStepTwo = () => {
  const { addModal } = useModals((state) => state);
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ShipmentFormInputs>();

  const { data } = useSWR<ProductsList>('/products/list', fetcher);

  const [productsIds, productsBought, expenses] = watch(['productsIds', 'productsBought', 'expenses']);
  const expensesTotal = calculateExpensesTotal(expenses);
  const productsTotal = calculateShipmentTotal(productsBought);

  useEffect(() => {
    const filteredProducts = productsBought.filter((pB) => productsIds.indexOf(pB.id) !== -1);

    setValue('productsBought', filteredProducts);
  }, [productsIds, setValue]);

  useEffect(() => {
    productsBought.forEach((pr, ind) => {
      const prPercentage = (pr.totalPrice / productsTotal) * 100;
      const prSlice = (prPercentage * expensesTotal) / 100;

      const roundedPrPercentage = Math.round(prPercentage * 100) / 100;
      const roundedPrSlice = parseFloat(prSlice.toFixed(0));

      setValue(`productsBought.${ind}.percentage`, roundedPrPercentage || 0);
      setValue(`productsBought.${ind}.expenseSlice`, roundedPrSlice || 0);
    });
  }, [productsTotal, expensesTotal, productsBought]);

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
        <LabeledInput label='Total des dépenses :' className='flex-1'>
          <NumberInput placeholder='0' value={expensesTotal} min={0} disabled enableStepper={false} />
        </LabeledInput>
      </FormRow>
      <FormRow>
        <LabeledInput label='Liste de produits :' className='min-w-[49%] max-w-[49%]'>
          <Controller
            name='productsIds'
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
        <LabeledInput label='Total des produits :' className='flex-1'>
          <NumberInput placeholder='0' value={productsTotal} min={0} disabled enableStepper={false} />
        </LabeledInput>
      </FormRow>
      {data?.products &&
        productsIds.map((id, ind) => {
          const currProduct = data.products.find((product) => product.id === id);
          if (currProduct) {
            setValue(`productsNames.${ind}`, currProduct.name);
            const productError =
              errors.productsBought && errors.productsBought[ind] ? errors.productsBought[ind] : null;

            return (
              <>
                <Divider className='my-0'>
                  {currProduct.name} ({currProduct.reference})
                </Divider>

                <FormRow key={id}>
                  <LabeledInput label='Nom du produit :' className='hidden'>
                    <TextInput {...register(`productsBought.${ind}.id`)} value={id} />
                  </LabeledInput>

                  <LabeledInput
                    id={`product-quantity-${ind}`}
                    label='Quantité :'
                    className='flex-1'
                    isError={!!productError?.quantity}
                    errorMessage={productError?.quantity && productError?.quantity.message}
                  >
                    <NumberInput
                      {...register(`productsBought.${ind}.quantity`, {
                        valueAsNumber: true,
                        required: { value: true, message: 'Quantité est requise' },
                        min: { value: 1, message: 'Quantité minimum 1' },
                      })}
                      placeholder='10'
                      min={0}
                      enableStepper={false}
                    />
                  </LabeledInput>
                  <LabeledInput
                    id={`product-price-${ind}`}
                    label='Prix :'
                    className='flex-1'
                    isError={!!productError?.totalPrice}
                    errorMessage={productError?.totalPrice && productError?.totalPrice.message}
                  >
                    <NumberInput
                      {...register(`productsBought.${ind}.totalPrice`, {
                        valueAsNumber: true,
                        required: { value: true, message: 'Prix est requis' },
                        min: { value: 0, message: 'Minimum est 0' },
                      })}
                      placeholder='100000'
                      min={0}
                      enableStepper={false}
                    />
                  </LabeledInput>
                  <LabeledInput
                    label='Pourcentage :'
                    className='flex-1'
                    isError={!!productError?.percentage}
                    errorMessage={productError?.percentage && productError?.percentage.message}
                  >
                    <NumberInput
                      {...register(`productsBought.${ind}.percentage`, {
                        valueAsNumber: true,
                      })}
                      placeholder='0'
                      min={0}
                      disabled
                      enableStepper={false}
                    />
                  </LabeledInput>
                  <LabeledInput
                    label='Dép :'
                    className='flex-1'
                    isError={!!productError?.expenseSlice}
                    errorMessage={productError?.expenseSlice && productError?.expenseSlice.message}
                  >
                    <NumberInput
                      {...register(`productsBought.${ind}.expenseSlice`, {
                        valueAsNumber: true,
                        required: { value: true, message: 'Tranche est requis' },
                        min: { value: 0, message: 'Minimum est 0' },
                      })}
                      placeholder='5000'
                      min={0}
                      disabled
                      enableStepper={false}
                    />
                  </LabeledInput>
                </FormRow>
              </>
            );
          }
        })}
    </>
  );
};

export default FormStepTwo;
