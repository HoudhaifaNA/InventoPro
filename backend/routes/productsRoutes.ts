import express from 'express';

import {
  createProduct,
  deleteProductsById,
  getAllProducts,
  getProductById,
  getProductsList,
  getProductsStore,
  updateProduct,
  uploadFile,
} from '../controllers/productsController';

const router = express.Router();

router.route('/').get(getAllProducts).post(uploadFile, createProduct);
router.route('/store').get(getProductsStore);
router.route('/list').get(getProductsList);
router.route('/:id').get(getProductById).patch(uploadFile, updateProduct).delete(deleteProductsById);

export default router;
