import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { eq, inArray, sql } from 'drizzle-orm';

import { db } from '../../db';
import { ProductInsert, products, shipments, shipmentsToProducts } from '../../db/schema';
import handleFileUpload from '../utils/handleFileUpload';
import deleteFile from '../utils/deleteFile';
import catchAsync from '../utils/catchAsync';
import { generateFilter, sortResults } from '../utils/APIFeatures';
import AppError from '../utils/AppError';
import formatDateTime from '../utils/formatDateTime';

const storage = multer.memoryStorage();

const multerFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const { mimetype } = file;
  const isImage = mimetype.startsWith('image');

  if (!isImage) {
    return cb(new AppError('Document invalide. Veuillez télécharger uniquement des images.', 400));
  }

  return cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: multerFilter });

export const uploadFile = upload.single('thumbnail');

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

export const getAllProducts = catchAsync(async (req, res) => {
  const { page, orderBy } = req.query;

  const pageNumber = typeof page === 'string' && !isNaN(parseInt(page)) ? parseInt(page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 2;

  const offset = limit * pageNumber - limit;
  const allProducts = await db.query.products.findMany({ where: generateFilter(req) });

  const productsList = await db.query.products.findMany({
    orderBy: sortResults(orderBy),
    where: generateFilter(req),
    limit,
    offset,
    with: {
      shipments: {
        columns: {
          productId: false,
          shipmentId: true,
          unitPrice: true,
          quantity: true,
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

  const companiesList = db
    .select({ company: products.company })
    .from(products)
    .groupBy((t) => [t.company])
    .all()
    .map(({ company }) => company);

  const categoriesList = db
    .select({ category: products.category })
    .from(products)
    .groupBy((t) => [t.category])
    .all()
    .map(({ category }) => category);

  res
    .status(200)
    .json({ results: allProducts.length, start: offset + 1, products: productsList, companiesList, categoriesList });
});

export const getProductById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await queryProduct(id);

  return res.status(200).json({ product });
});

export const createProduct = catchAsync(async (req, res, next) => {
  const { name, reference, company, category, stock, retailPrice, wholesalePrice } = req.body;
  const { file } = req;
  let thumbnail;

  try {
    if (file) {
      thumbnail = await handleFileUpload(file);
    }

    const newProductBody: ProductInsert = {
      name,
      reference,
      company,
      thumbnail,
      category,
      stock,
      retailPrice,
      wholesalePrice,
    };

    const newProduct = db.insert(products).values(newProductBody).returning().get();

    return res.status(201).json({ message: 'Produit créé avec succès.', product: newProduct });
  } catch (err) {
    console.log(err);

    if (thumbnail) {
      deleteFile(thumbnail);
    }
    if (err instanceof AppError) {
      return next(err);
    }

    return next(new AppError("Erreur lors de la création d'un produit.", 403));
  }
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    reference,
    company,
    category,
    currentShipmentId,
    retailPercentage,
    wholesalePercentage,
    retailPrice,
    wholesalePrice,
  } = req.body;
  const { file } = req;
  const { id } = req.params;
  const product = await queryProduct(id);
  const oldThumbnail = product?.thumbnail;
  let thumbnail = null;

  try {
    if (!product) {
      return next(new AppError('Produit non trouvé..', 404));
    }
    const isSameFile = file?.originalname === oldThumbnail;

    if (file && !isSameFile) {
      thumbnail = await handleFileUpload(file);
    } else if (isSameFile) {
      thumbnail = oldThumbnail;
    }

    const shipmentIndex = product?.shipments.findIndex((shipment) => shipment.shipmentId === currentShipmentId);

    if (currentShipmentId && shipmentIndex === -1) {
      return next(new AppError('Invalid shipment', 401));
    }

    const productBody: ProductInsert = {
      name,
      reference,
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

    const updatedProduct = db.update(products).set(productBody).where(eq(products.id, id)).returning().get();

    if ((thumbnail && oldThumbnail && !isSameFile) || (!thumbnail && oldThumbnail)) {
      deleteFile(oldThumbnail);
    }

    return res.status(201).json({ message: 'Produit mis à jour avec succès.', product: updatedProduct });
  } catch (err) {
    console.log(err);

    if (thumbnail && thumbnail !== oldThumbnail) {
      deleteFile(thumbnail);
    }

    if (err instanceof AppError) {
      return next(err);
    }

    return next(new AppError('Erreur lors de la mise à jour du produit.', 403));
  }
});
export const deleteProductsById = catchAsync((req, res, next) => {
  const { id } = req.params;
  const idsList = id.split(',');

  try {
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
      deletedProducts.forEach(async ({ thumbnail }) => {
        if (thumbnail) {
          await deleteFile(thumbnail);
        }
      });
    });

    return res.status(204).json({});
  } catch (err) {
    console.log(err);

    if (err instanceof AppError) {
      return next(err);
    }

    return next(new AppError('Erreur lors de la suppression du produit.', 403));
  }
});
