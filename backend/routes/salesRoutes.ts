import express from 'express';

import { deleteSalesById, getSales, saleProduct, updateSale } from '../controllers/salesController';

const router = express.Router();

router.route('/').get(getSales).post(saleProduct);
router.route('/:id').patch(updateSale).delete(deleteSalesById);

export default router;
