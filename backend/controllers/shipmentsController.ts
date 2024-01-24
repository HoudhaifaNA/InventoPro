import { and, eq, inArray, sql } from 'drizzle-orm';

import { db } from '../../db';
import { ShipmentInsert, ShipmentToProductInsert, products, shipments, shipmentsToProducts } from '../../db/schema';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import formatDateTime from '../utils/formatDateTime';
import { calculateExpensesTotal, calculateShipmentTotal } from '../utils/calculations';
import { isValidExpenses, isValidProducts } from '../../types';

export const getShipments = catchAsync(async (_req, res) => {
  const shipments = await db.query.shipments.findMany({
    with: {
      products: {
        columns: {
          productId: false,
          shipmentId: false,
        },

        with: {
          products: {
            columns: {
              id: true,
              retailPrice: true,
              wholesalePrice: true,
            },
          },
        },
      },
    },
  });
  return res.status(200).json({ results: shipments.length, shipments });
});

export const getProductShipments = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const shipments = await db.query.shipmentsToProducts.findMany({
    where: eq(shipmentsToProducts.productId, productId),
    columns: {
      unitPrice: true,
    },
    with: {
      shipments: {
        columns: {
          id: true,
          shipmentDate: true,
          shipmentCode: true,
        },
      },
    },
  });
  return res.status(200).json({ shipments });
});

export const createShipment = catchAsync((req, res, next) => {
  const { shipmentDate, expenses, shipmentCode, productsBought, arrivalDate } = req.body;

  if (!isValidExpenses(expenses)) {
    return next(new AppError('Données de dépenses invalides. Veuillez vérifier votre saisie.', 400));
  }

  if (!isValidProducts(productsBought)) {
    return next(new AppError('Données produit invalides. Veuillez vérifier votre saisie.', 400));
  }

  const expensesTotal = calculateExpensesTotal(expenses);
  const productsTotal = calculateShipmentTotal(productsBought);
  const productsCount = productsBought.length;

  const newShipmentBody: ShipmentInsert = {
    shipmentDate: formatDateTime(shipmentDate),
    expenses,
    shipmentCode,
    arrivalDate,
    productsCount,
    total: expensesTotal + productsTotal,
  };

  const newShipment = db.transaction((tx) => {
    const newShipment = tx.insert(shipments).values(newShipmentBody).returning().get();

    productsBought.forEach(({ id, quantity, expenseSlice, totalPrice }) => {
      const unitPrice = (expenseSlice + totalPrice) / quantity;

      const shipmentToProductBody: ShipmentToProductInsert = {
        productId: id,
        shipmentId: newShipment.id,
        quantity,
        expenseSlice,
        unitPrice,
        totalPrice,
      };

      tx.update(products)
        .set({
          stock: sql`${products.stock} + ${quantity}`,
          updatedAt: formatDateTime(new Date()),
        })
        .where(eq(products.id, id))
        .run();

      tx.insert(shipmentsToProducts).values(shipmentToProductBody).run();
    });

    return newShipment;
  });

  return res.status(201).json({ message: 'Expédition créée avec succès.', shipment: newShipment });
});

export const updateShipment = catchAsync((req, res, next) => {
  const { id } = req.params;
  const { shipmentDate, expenses, shipmentCode, productsBought, arrivalDate } = req.body;

  if (!isValidExpenses(expenses)) {
    return next(new AppError('Données de dépenses invalides. Veuillez vérifier votre saisie.', 400));
  }

  if (!isValidProducts(productsBought)) {
    return next(new AppError('Données produit invalides. Veuillez vérifier votre saisie.', 400));
  }

  const updatedAt = formatDateTime(new Date());
  const expensesTotal = calculateExpensesTotal(expenses);
  const productsTotal = calculateShipmentTotal(productsBought);
  const productsCount = productsBought.length;

  const shipmentBody: ShipmentInsert = {
    shipmentDate: formatDateTime(shipmentDate),
    expenses,
    shipmentCode,
    arrivalDate,
    productsCount,
    total: expensesTotal + productsTotal,
    updatedAt,
  };

  const oldShipment = db.select().from(shipments).where(eq(shipments.id, id)).get();

  if (!oldShipment) {
    return next(new AppError('Expédition introuvable. Veuillez vérifier les informations fournies.', 400));
  }

  const shipment = db.transaction((tx) => {
    const updatedShipment = tx.update(shipments).set(shipmentBody).where(eq(shipments.id, id)).returning().get();

    const oldShipmentProducts = tx
      .select()
      .from(shipmentsToProducts)
      .where(eq(shipmentsToProducts.shipmentId, updatedShipment.id))
      .all();

    oldShipmentProducts.forEach((oldShipmentProduct) => {
      const isProductInNewUpdate = productsBought.some((newProduct) => newProduct.id === oldShipmentProduct.productId);

      if (!isProductInNewUpdate) {
        tx.delete(shipmentsToProducts)
          .where(
            and(
              eq(shipmentsToProducts.shipmentId, updatedShipment.id),
              eq(shipmentsToProducts.productId, oldShipmentProduct.productId)
            )
          )
          .run();

        tx.update(products)
          .set({ stock: sql`${products.stock} - ${oldShipmentProduct.quantity}`, updatedAt })
          .where(eq(products.id, oldShipmentProduct.productId))
          .run();
      }
    });

    productsBought.forEach(({ id, quantity, expenseSlice, totalPrice }) => {
      const unitPrice = (expenseSlice + totalPrice) / quantity;

      const shipmentToProductBody: ShipmentToProductInsert = {
        productId: id,
        shipmentId: updatedShipment.id,
        quantity,
        expenseSlice,
        unitPrice,
        totalPrice,
      };

      const oldShipmentProduct = tx
        .select()
        .from(shipmentsToProducts)
        .where(and(eq(shipmentsToProducts.shipmentId, updatedShipment.id), eq(shipmentsToProducts.productId, id)))
        .get();

      tx.update(products)
        .set({ stock: sql`${products.stock} - ${oldShipmentProduct?.quantity || 0} + ${quantity}`, updatedAt })
        .where(eq(products.id, id))
        .run();

      tx.update(products)
        .set({
          retailPrice: sql`((${products.retailPercentage} * ${unitPrice}) / 100 ) + ${unitPrice}`,
          wholesalePrice: sql`((${products.wholesalePercentage} * ${unitPrice}) / 100 ) + ${unitPrice}`,
        })
        .where(eq(products.currentShipmentId, updatedShipment.id))
        .run();

      if (oldShipmentProduct) {
        tx.update(shipmentsToProducts)
          .set(shipmentToProductBody)
          .where(and(eq(shipmentsToProducts.shipmentId, updatedShipment.id), eq(shipmentsToProducts.productId, id)))
          .run();
      } else {
        tx.insert(shipmentsToProducts).values(shipmentToProductBody).run();
      }
    });

    return updatedShipment;
  });

  return res.status(200).json({ message: 'Expédition mise à jour avec succès.', shipment });
});

export const deleteShipmentsById = catchAsync((req, res, next) => {
  const { id } = req.params;

  const idsList = id.split(',');

  const productsWithShipment = db.select().from(products).where(inArray(products.currentShipmentId, idsList)).all();

  if (productsWithShipment.length > 0) {
    return next(new AppError("L'expédition comporte des produits pertinents.", 400));
  }

  db.transaction((tx) => {
    const deletedShipmentsToProducts = tx
      .delete(shipmentsToProducts)
      .where(inArray(shipmentsToProducts.shipmentId, idsList))
      .returning()
      .all();

    deletedShipmentsToProducts.forEach(({ productId, quantity }) => {
      tx.update(products)
        .set({
          stock: sql`${products.stock} -  ${quantity}`,
          updatedAt: formatDateTime(new Date()),
        })
        .where(eq(products.id, productId))
        .run();
    });

    tx.delete(shipments).where(inArray(shipments.id, idsList)).run();
  });

  return res.status(204).json({});
});
