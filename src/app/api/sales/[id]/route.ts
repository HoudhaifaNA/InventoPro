import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { sales } from '@/db/schema';
import { DynamicAPIRouteParams } from '@/types';
import formatDateTime from '@/utils/formatDateTime';
import checkBodyData from '../checkBody';

export async function PATCH(request: NextRequest, { params }: DynamicAPIRouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    const { soldAt, type, quantity, price } = body;
    checkBodyData(body);

    const saleBody = {
      soldAt: formatDateTime(soldAt),
      type,
      quantity,
      price,
      total: quantity * price,
      updatedAt: formatDateTime(new Date()),
    };

    const [updatedSale] = await db.update(sales).set(saleBody).where(eq(sales.id, id)).returning();

    return NextResponse.json({ message: 'Sale updated', sale: updatedSale }, { status: 200, statusText: 'success' });
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

    await db.delete(sales).where(eq(sales.id, id));

    return new Response(null, { status: 204 });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500, statusText: err.name });
    }
    return NextResponse.json({ message: 'Uknown Error' }, { status: 500, statusText: 'Server error' });
  }
}
