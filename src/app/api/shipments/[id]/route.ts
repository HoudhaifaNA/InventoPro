import { NextRequest, NextResponse } from 'next/server';
import { and, eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { ShipmentInsert, ShipmentToProductInsert, products, shipments, shipmentsToProducts } from '@/db/schema';
import formatDateTime from '@/utils/formatDateTime';
import { DynamicAPIRouteParams, isValidExpenses, isValidProducts } from '@/types';
import { calculateExpensesTotal, calculatePriceByPercentage, calculateShipmentTotal } from '@/utils/calculations';

export async function PATCH(request: NextRequest, { params }: DynamicAPIRouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    const { shipmentDate, expenses, shipmentCode, productsBought, arrivalDate } = body;

    if (!isValidExpenses(expenses)) {
      return NextResponse.json({ message: 'Invalid expenses' }, { status: 500, statusText: 'Server error' });
    }

    if (!isValidProducts(productsBought)) {
      return NextResponse.json({ message: 'Invalid products' }, { status: 500, statusText: 'Server error' });
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

    const [oldShipment] = await db.select().from(shipments).where(eq(shipments.id, id));

    if (!oldShipment) {
      return NextResponse.json({ message: 'Shipment not found' }, { status: 404, statusText: 'Server error' });
    }

    const shipment = await db.transaction(async (tx) => {
      const [updatedShipment] = await tx.update(shipments).set(shipmentBody).where(eq(shipments.id, id)).returning();

      const oldShipmentProducts = await tx
        .select()
        .from(shipmentsToProducts)
        .where(eq(shipmentsToProducts.shipmentId, updatedShipment.id));

      oldShipmentProducts.forEach((oldShipmentProduct) => {
        const isProductInNewUpdate = productsBought.some(
          (newProduct) => newProduct.id === oldShipmentProduct.productId
        );

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

      productsBought.forEach(({ id, quantity, totalPrice }) => {
        const unitPrice = (expensesTotal / productsCount + totalPrice) / quantity;

        const shipmentToProductBody: ShipmentToProductInsert = {
          productId: id,
          shipmentId: updatedShipment.id,
          quantity,
          unitPrice,
          totalPrice,
        };

        (async () => {
          const [oldShipmentProduct] = await tx
            .select()
            .from(shipmentsToProducts)
            .where(and(eq(shipmentsToProducts.shipmentId, updatedShipment.id), eq(shipmentsToProducts.productId, id)));

          await tx
            .update(products)
            .set({ stock: sql`${products.stock} - ${oldShipmentProduct.quantity || 0} + ${quantity}`, updatedAt })
            .where(eq(products.id, id))
            .run();

          await tx
            .update(products)
            .set({
              retailPrice: sql`((${products.retailPercentage} * ${unitPrice}) / 100 ) + ${unitPrice}`,
              wholesalePrice: sql`((${products.wholesalePercentage} * ${unitPrice}) / 100 ) + ${unitPrice}`,
            })
            .where(eq(products.currentShipmentId, updatedShipment.id))
            .run();

          if (oldShipmentProduct) {
            await tx
              .update(shipmentsToProducts)
              .set(shipmentToProductBody)
              .where(and(eq(shipmentsToProducts.shipmentId, updatedShipment.id), eq(shipmentsToProducts.productId, id)))
              .run();
          } else {
            await tx.insert(shipmentsToProducts).values(shipmentToProductBody).run();
          }
        })();
      });

      return updatedShipment;
    });

    return NextResponse.json({ message: 'Shipment updated', shipment }, { status: 200, statusText: 'success' });
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

    await db.delete(products).where(eq(products.id, id));

    return new Response(null, { status: 204 });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500, statusText: err.name });
    }
    return NextResponse.json({ message: 'Uknown Error' }, { status: 500, statusText: 'Server error' });
  }
}
