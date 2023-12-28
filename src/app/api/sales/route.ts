import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/db';
import { SaleInsert, products, sales } from '@/db/schema';
import formatDateTime from '@/utils/formatDateTime';
import checkBodyData from './checkBody';
import { eq, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { soldAt, productId, type, quantity, price } = body;
    checkBodyData(body);

    const updatedAt = formatDateTime(new Date());

    const product = db.select().from(products).where(eq(products.id, productId)).get();

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404, statusText: 'Server error' });
    }

    if (product.stock - quantity < 0) {
      return NextResponse.json({ message: 'Low stock error' }, { status: 401, statusText: 'Server error' });
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

    return NextResponse.json({ message: 'Product sold', sale: newSale }, { status: 201, statusText: 'success' });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500, statusText: err.name });
    }
    return NextResponse.json({ message: 'Uknown Error' }, { status: 500, statusText: 'Server error' });
  }
}
