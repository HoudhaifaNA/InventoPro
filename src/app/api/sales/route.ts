import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/db';
import { SaleInsert, sales } from '@/db/schema';
import formatDateTime from '@/utils/formatDateTime';
import checkBodyData from './checkBody';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { soldAt, productId, type, quantity, price } = body;
    checkBodyData(body);

    const newSaleBody: SaleInsert = {
      productId,
      soldAt: formatDateTime(soldAt),
      type,
      quantity,
      price,
      total: quantity * price,
    };

    const [newSale] = await db.insert(sales).values(newSaleBody).returning();

    return NextResponse.json({ message: 'Product sold', product: newSale }, { status: 201, statusText: 'success' });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500, statusText: err.name });
    }
    return NextResponse.json({ message: 'Uknown Error' }, { status: 500, statusText: 'Server error' });
  }
}
