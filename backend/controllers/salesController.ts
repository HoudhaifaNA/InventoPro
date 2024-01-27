import { eq, inArray, sql } from 'drizzle-orm';

import { db } from '../../db';
import { SaleInsert, products, sales } from '../../db/schema';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';
import formatDateTime from '../utils/formatDateTime';
import { sortResults } from '../utils/APIFeatures';

const checkBodyData = (body: any) => {
  const { type } = body;

  if (!['wholesale', 'retail'].includes(type)) {
    throw new AppError('Invalid type.', 400);
  }
};

export const getSales = catchAsync(async (req, res) => {
  const { orderBy } = req.query;

  const salesList = await db.query.sales.findMany({
    orderBy: sortResults(orderBy, sales),

    with: {
      product: {
        columns: {
          name: true,
          reference: true,
        },
      },
    },
  });

  return res.status(200).json({ results: salesList.length, sales: salesList });
});

export const saleProduct = catchAsync((req, res, next) => {
  const body = req.body;
  const { soldAt, productId, type, quantity, price } = body;
  checkBodyData(body);

  const updatedAt = formatDateTime(new Date());

  const product = db.select().from(products).where(eq(products.id, productId)).get();

  if (!product) {
    return next(new AppError('Produit non trouvé.', 404));
  }

  if (product.stock - quantity < 0) {
    return next(new AppError('Stock insuffisant. Veuillez vérifier les niveaux de stock disponibles.', 400));
  }

  const newSale = db.transaction((tx) => {
    const newSaleBody: SaleInsert = {
      productId,
      soldAt: formatDateTime(soldAt),
      type,
      quantity,
      price,
      total: quantity * price,
    };

    const newSale = tx.insert(sales).values(newSaleBody).returning().get();

    tx.update(products)
      .set({ stock: sql`${products.stock} - ${quantity}`, updatedAt })
      .where(eq(products.id, productId))
      .run();

    return newSale;
  });

  return res.status(201).json({ message: 'Produit vendu avec succès.', sale: newSale });
});

export const updateSale = catchAsync((req, res, next) => {
  const { id } = req.params;
  const body = req.body;
  const { soldAt, type, quantity, price } = body;
  checkBodyData(body);

  const updatedAt = formatDateTime(new Date());
  const oldSale = db.select().from(sales).where(eq(sales.id, id)).get();

  if (!oldSale) {
    return next(new AppError('Vente non trouvée.', 404));
  }

  const product = db.select().from(products).where(eq(products.id, oldSale.productId)).get();
  const newQuantity = product!.stock + oldSale.quantity - quantity;

  if (newQuantity < 0) {
    return next(new AppError('Stock insuffisant. Veuillez vérifier les niveaux de stock disponibles.', 404));
  }

  const sale = db.transaction((tx) => {
    const saleBody = {
      soldAt: formatDateTime(soldAt),
      type,
      quantity,
      price,
      total: quantity * price,
      updatedAt,
    };

    const updatedSale = tx.update(sales).set(saleBody).where(eq(sales.id, id)).returning().get();

    tx.update(products)
      .set({ stock: sql`(${products.stock} + ${oldSale.quantity}) - ${quantity}`, updatedAt })
      .where(eq(products.id, updatedSale.productId))
      .run();

    return updatedSale;
  });
  return res.status(200).json({ message: 'Vente mise à jour avec succès.', sale });
});

export const deleteSalesById = catchAsync((req, res) => {
  const { id } = req.params;
  const idsList = id.split(',');

  const updatedAt = formatDateTime(new Date());

  db.transaction((tx) => {
    const deletedSales = tx.delete(sales).where(inArray(sales.id, idsList)).returning().all();
    deletedSales.forEach((sale) => {
      tx.update(products)
        .set({ stock: sql`${products.stock} + ${sale?.quantity || 0}`, updatedAt })
        .where(eq(products.id, sale.productId))
        .run();
    });
  });

  return res.status(204).json({});
});
