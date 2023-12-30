import { InferInsertModel, InferSelectModel, relations, sql } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

import { Expense } from '@/types';

export const products = sqliteTable('products', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  ref: text('ref').unique(),
  thumbnail: text('thumbnail'),
  company: text('company'),
  category: text('category'),
  stock: integer('stock').notNull().default(0),
  currentShipmentId: text('current_shipment_id').references(() => shipments.id),
  retailPercentage: integer('retail_percentage').notNull().default(0),
  wholesalePercentage: integer('wholesale_percentage').notNull().default(0),
  retailPrice: integer('retail_price').notNull().default(0),
  wholesalePrice: integer('wholesale_price').notNull().default(0),
  createdAt: text('created_at').default(sql`(datetime('now','localtime'))`),
  updatedAt: text('updated_at').default(sql`(datetime('now','localtime'))`),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  shipments: many(shipmentsToProducts),
  currentShipment: one(shipments, {
    fields: [products.currentShipmentId],
    references: [shipments.id],
  }),
}));

export const shipments = sqliteTable('shipments', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  shipmentCode: text('shipment_code').unique(),
  shipmentDate: text('shipment_date').notNull(),
  arrivalDate: text('arrival_date'),
  expenses: text('expenses', { mode: 'json' }).notNull().$type<Expense[]>(),
  productsCount: integer('products_count').notNull().default(0),
  total: integer('total').notNull().default(0),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now','localtime'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now','localtime'))`),
});

export const shipmentsRelations = relations(shipments, ({ many }) => ({
  products: many(shipmentsToProducts),
}));

export const shipmentsToProducts = sqliteTable(
  'shipments_to_products',
  {
    productId: text('product_id')
      .notNull()
      .references(() => products.id),
    shipmentId: text('shipment_id')
      .notNull()
      .references(() => shipments.id),
    quantity: integer('quantity').notNull().default(0),
    unitPrice: integer('unit_price').notNull().default(0),
    totalPrice: integer('total_price').notNull().default(0),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productId, t.shipmentId] }),
  })
);

export const shipmentsToProductsRelations = relations(shipmentsToProducts, ({ one }) => ({
  products: one(products, {
    fields: [shipmentsToProducts.productId],
    references: [products.id],
  }),
  shipments: one(shipments, {
    fields: [shipmentsToProducts.shipmentId],
    references: [shipments.id],
  }),
}));

export const sales = sqliteTable('sales', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  productId: text('product_id')
    .notNull()
    .references(() => products.id),
  soldAt: text('sold_at')
    .notNull()
    .default(sql`(datetime('now','localtime'))`),
  type: text('type', { enum: ['retail', 'wholesale'] }).notNull(),
  quantity: integer('quantity').notNull().default(0),
  price: integer('price').notNull().default(0),
  total: integer('total').notNull().default(0),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now','localtime'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now','localtime'))`),
});

export const salesRelations = relations(sales, ({ one }) => ({
  product: one(products, {
    fields: [sales.productId],
    references: [products.id],
  }),
}));

export type ProductInsert = InferInsertModel<typeof products>;
export type ProductSelect = InferSelectModel<typeof products>;

export type ShipmentInsert = InferInsertModel<typeof shipments>;
export type ShipmentSelect = InferSelectModel<typeof shipments>;

export type SaleInsert = InferInsertModel<typeof sales>;
export type SaleSelect = InferSelectModel<typeof sales>;

export type ShipmentToProductInsert = InferInsertModel<typeof shipmentsToProducts>;
export type ShipmentToProductSelect = InferSelectModel<typeof shipmentsToProducts>;
