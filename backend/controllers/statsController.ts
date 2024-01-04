import { count, countDistinct, eq, sql, sum } from 'drizzle-orm';

import { products, sales, shipments, shipmentsToProducts } from '../../db/schema';
import catchAsync from '../utils/catchAsync';
import { db } from '../../db';

export const getStats = catchAsync((_req, res) => {
  const productsBought = db
    .select({
      count: countDistinct(shipmentsToProducts.productId).mapWith(Number),
      total: sum(shipmentsToProducts.totalPrice).mapWith(Number),
    })
    .from(shipmentsToProducts)
    .get();

  const totalSales = db
    .select({
      count: count(sales.id),
      quantity: sum(sales.quantity).mapWith(Number),
      total: sum(sales.total).mapWith(Number),
    })
    .from(sales)
    .get();

  const totalExpenses = db
    .select({ count: sql`COUNT(json_extract(value, '$.id'))`, total: sql`SUM(json_extract(value, '$.cost_in_dzd'))` })
    .from(sql`shipments, JSON_EACH(expenses)`)
    .get();

  const totalShipments = db
    .select({ count: count(shipments.id), total: sum(shipments.expenses).mapWith(Number) })
    .from(shipments)
    .get();

  const purchasesPerMonth = db
    .select({
      month: sql`strftime('%Y-%m', shipments.shipment_date)`.mapWith(String),
      purchases: count(shipmentsToProducts.shipmentId),
    })
    .from(shipmentsToProducts)
    .leftJoin(shipments, eq(shipmentsToProducts.shipmentId, shipments.id))
    .groupBy(sql`strftime('%Y-%m', shipments.shipment_date)`)
    .all();

  const salesPerMonth = db
    .select({ month: sql`strftime('%Y-%m', sales.sold_at)`.mapWith(String), sales: count(sales.id) })
    .from(sales)
    .groupBy(sql`strftime('%Y-%m', sales.sold_at)`)
    .all();

  const allMonths = Array.from(
    new Set([...purchasesPerMonth.map((item) => item.month), ...salesPerMonth.map((item) => item.month)])
  );

  const productsStatsPerMonth = allMonths
    .map((month) => {
      const purchase = purchasesPerMonth.find((item) => item.month === month);
      const sale = salesPerMonth.find((item) => item.month === month);

      return {
        month,
        purchases: purchase?.purchases || 0,
        sales: sale?.sales || 0,
      };
    })
    .sort((prev, curr) => prev.month.localeCompare(curr.month));

  const topFiveProducts = db
    .select({
      name: products.name,
      salesCount: sql<number>`SUM(${sales.quantity})`.mapWith(Number).as('sales_count'),
    })

    .from(sales)
    .leftJoin(products, eq(products.id, sales.productId))
    .groupBy(sales.productId)
    .orderBy(sql`sales_count desc`)
    .limit(5)
    .all();

  return res
    .status(200)
    .json({ productsBought, totalSales, totalExpenses, totalShipments, productsStatsPerMonth, topFiveProducts });
});
