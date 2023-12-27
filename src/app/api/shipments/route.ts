import { NextRequest, NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { ShipmentInsert, ShipmentToProductInsert, products, shipments, shipmentsToProducts } from '@/db/schema';
import { isValidExpenses, isValidProducts } from '@/types';
import { calculateExpensesTotal, calculateShipmentTotal } from '@/utils/calculations';
import formatDateTime from '@/utils/formatDateTime';

export async function GET() {
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
  return NextResponse.json({ results: shipments.length, shipments }, { status: 200, statusText: 'success' });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shipmentDate, expenses, shipmentCode, productsBought, arrivalDate } = body;

    if (!isValidExpenses(expenses)) {
      return NextResponse.json({ message: 'Invalid expenses' }, { status: 500, statusText: 'Server error' });
    }

    if (!isValidProducts(productsBought)) {
      return NextResponse.json({ message: 'Invalid products' }, { status: 500, statusText: 'Server error' });
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

      productsBought.forEach(({ id, quantity, totalPrice }) => {
        const unitPrice = (expensesTotal / productsCount + totalPrice) / quantity;

        const shipmentToProductBody: ShipmentToProductInsert = {
          productId: id,
          shipmentId: newShipment.id,
          quantity,
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

    return NextResponse.json(
      { message: 'Shipment created', shipment: newShipment },
      { status: 201, statusText: 'success' }
    );
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500, statusText: err.name });
    }
    return NextResponse.json({ message: 'Uknown Error' }, { status: 500, statusText: 'Server error' });
  }
}
