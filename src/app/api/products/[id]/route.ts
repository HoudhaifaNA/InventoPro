import { NextRequest, NextResponse } from 'next/server';
import { eq, inArray, sql } from 'drizzle-orm';

import { db } from '@/db';
import { ProductInsert, products, shipments, shipmentsToProducts } from '@/db/schema';
import formatDateTime from '@/utils/formatDateTime';
import { DynamicAPIRouteParams } from '@/types';
import handleFileUpload from '../handleFileUpload';
import deleteFile from '../deleteFile';

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
  const { id } = params;
  const product = await queryProduct(id);
  const oldThumbnail = product?.thumbnail;
  let thumbnail = null;

  try {
    if (!product) {
      throw Error('Product not found');
    }
    const data = await request.formData();
    const body: any = {};
    data.forEach((value, key) => (body[key] = value));

    const {
      name,
      ref,
      file,
      company,
      category,
      currentShipmentId,
      retailPercentage,
      wholesalePercentage,
      retailPrice,
      wholesalePrice,
    } = body;

    const isValidFile = file instanceof File && file.type.startsWith('image');
    const isSameFile = file?.name === oldThumbnail;

    if (isValidFile && !isSameFile) {
      thumbnail = await handleFileUpload(file);
    } else if (isSameFile) {
      thumbnail = oldThumbnail;
    }

    const shipmentIndex = product?.shipments.findIndex((shipment) => shipment.shipmentId === currentShipmentId);

    if (currentShipmentId && shipmentIndex === -1) {
      return NextResponse.json({ message: 'Invalid shipment' }, { status: 401, statusText: 'error' });
    }

    const productBody: ProductInsert = {
      name,
      ref,
      thumbnail,
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

    if ((thumbnail && oldThumbnail && !isSameFile) || (!thumbnail && oldThumbnail)) {
      deleteFile(oldThumbnail);
    }

    return NextResponse.json(
      { message: 'Product updated', product: updatedProduct },
      { status: 200, statusText: 'success' }
    );
  } catch (err) {
    console.log(err);

    if (thumbnail && thumbnail !== oldThumbnail) {
      deleteFile(thumbnail);
    }

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

      const deletedProducts = tx.delete(products).where(inArray(products.id, idsList)).returning().all();
      deletedProducts.forEach(({ thumbnail }) => {
        if (thumbnail) {
          deleteFile(thumbnail);
        }
      });
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
