import express from 'express';

import {
  createProduct,
  deleteProductsById,
  getAllProducts,
  getProductById,
  updateProduct,
  uploadFile,
} from '../controllers/productsController';

const router = express.Router();

router.route('/').get(getAllProducts).post(uploadFile, createProduct);
router.route('/:id').get(getProductById).patch(uploadFile, updateProduct).delete(deleteProductsById);

export default router;
