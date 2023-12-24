import { InferInsertModel, InferSelectModel, relations, sql } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

interface Expense {
  id: string;
  raison: string;
  cost_in_usd: number;
  cost_in_rmb: number;
  cost_in_dzd: number;
}

export const products = sqliteTable('products', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  ref: text('ref').unique(),
  company: text('company'),
  category: text('category'),
  stock: integer('stock').notNull().default(0),
  retailPrice: integer('retail_price').notNull().default(0),
  wholesalePrice: integer('wholesale_price').notNull().default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const productsRelations = relations(products, ({ many }) => ({
  shipments: many(shipmentsToProducts),
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
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
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
    price: integer('price').notNull().default(0),
    quantity: integer('quantity').notNull().default(0),
    shipmentId: text('shipment_id')
      .notNull()
      .references(() => shipments.id),
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

export type ProductInsert = InferInsertModel<typeof products>;
export type ProductSelect = InferSelectModel<typeof products>;

export type ShipmentInsert = InferInsertModel<typeof shipments>;
export type ShipmentSelect = InferSelectModel<typeof shipments>;

export type ShipmentToProductInsert = InferInsertModel<typeof shipmentsToProducts>;
export type ShipmentToProductSelect = InferSelectModel<typeof shipmentsToProducts>;
