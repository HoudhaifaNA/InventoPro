import { NextRequest, NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { products, sales } from '@/db/schema';
import { DynamicAPIRouteParams } from '@/types';
import formatDateTime from '@/utils/formatDateTime';
import checkBodyData from '../checkBody';

export async function PATCH(request: NextRequest, { params }: DynamicAPIRouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    const { soldAt, type, quantity, price } = body;
    checkBodyData(body);

    const updatedAt = formatDateTime(new Date());
    const oldSale = db.select().from(sales).where(eq(sales.id, id)).get();

    if (!oldSale) {
      return NextResponse.json({ message: 'Sale not found' }, { status: 404, statusText: 'Server error' });
    }

    const product = db.select().from(products).where(eq(products.id, oldSale.productId)).get();
    const newQuantity = product!.stock + oldSale.quantity - quantity;

    if (newQuantity < 0) {
      return NextResponse.json({ message: 'Low stock error' }, { status: 401, statusText: 'Server error' });
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

    return NextResponse.json({ message: 'Sale updated', sale }, { status: 200, statusText: 'success' });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500, statusText: err.name });
    }
    return NextResponse.json({ message: 'Uknown Error' }, { status: 500, statusText: 'Server error' });
  }
}

export async function DELETE(_request: NextRequest, { params }: DynamicAPIRouteParams) {
  try {
    const { id } = params;
    const updatedAt = formatDateTime(new Date());

    db.transaction((tx) => {
      const sale = tx.delete(sales).where(eq(sales.id, id)).returning().get();

      if (sale) {
        tx.update(products)
          .set({ stock: sql`${products.stock} + ${sale?.quantity}`, updatedAt })
          .where(eq(products.id, sale.productId))
          .run();
      }
    });

    return new Response(null, { status: 204 });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500, statusText: err.name });
    }
    return NextResponse.json({ message: 'Uknown Error' }, { status: 500, statusText: 'Server error' });
  }
}
