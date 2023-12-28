import { NextRequest, NextResponse } from 'next/server';
import { eq, inArray, sql } from 'drizzle-orm';

import { db } from '@/db';
import { ProductInsert, products, shipments, shipmentsToProducts } from '@/db/schema';
import formatDateTime from '@/utils/formatDateTime';
import { DynamicAPIRouteParams } from '@/types';
import { calculatePriceByPercentage } from '@/utils/calculations';

const queryProduct = async (id: string) => {
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      shipments: {
        columns: {
          productId: false,
          quantity: false,
          shipmentId: true,
          unitPrice: true,
        },

        with: {
          shipments: {
            columns: {
              shipmentCode: true,
              arrivalDate: true,
            },
          },
        },
      },
    },
  });

  return product;
};

export async function GET(_request: NextRequest, { params }: DynamicAPIRouteParams) {
  const { id } = params;
  const product = await queryProduct(id);

  return NextResponse.json({ product }, { status: 200 });
}

export async function PATCH(request: NextRequest, { params }: DynamicAPIRouteParams) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      name,
      ref,
      company,
      category,
      currentShipmentId,
      retailPercentage,
      wholesalePercentage,
      retailPrice,
      wholesalePrice,
    } = body;

    const product = await queryProduct(id);

    const shipmentIndex = product?.shipments.findIndex((shipment) => shipment.shipmentId === currentShipmentId);

    if (currentShipmentId && shipmentIndex === -1) {
      return NextResponse.json({ message: 'Invalid shipment' }, { status: 401, statusText: 'error' });
    }

    const productBody: ProductInsert = {
      name,
      ref,
      company,
      category,
      currentShipmentId,
      retailPercentage,
      wholesalePercentage,
      retailPrice,
      wholesalePrice,
      updatedAt: formatDateTime(new Date()),
    };

    const [updatedProduct] = await db.update(products).set(productBody).where(eq(products.id, id)).returning();

    return NextResponse.json(
      { message: 'Product updated', product: updatedProduct },
      { status: 200, statusText: 'success' }
    );
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

    const idsList = id.split(',');

    db.transaction((tx) => {
      const deletedShipmentsToProducts = tx
        .delete(shipmentsToProducts)
        .where(inArray(shipmentsToProducts.productId, idsList))
        .returning()
        .all();

      deletedShipmentsToProducts.forEach(({ shipmentId, totalPrice }) => {
        tx.update(shipments)
          .set({
            productsCount: sql`${shipments.productsCount} - 1`,
            total: sql`${shipments.total} - ${totalPrice}`,
            updatedAt: formatDateTime(new Date()),
          })
          .where(eq(shipments.id, shipmentId))
          .run();
      });

      tx.delete(products).where(inArray(products.id, idsList)).run();
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
