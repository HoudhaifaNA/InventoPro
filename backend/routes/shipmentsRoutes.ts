import express from 'express';

import {
  createShipment,
  deleteShipmentsById,
  getProductShipments,
  getShipments,
  updateShipment,
} from '../controllers/shipmentsController';

const router = express.Router();

router.route('/').get(getShipments).post(createShipment);
router.route('/product/:productId').get(getProductShipments);
router.route('/:id').patch(updateShipment).delete(deleteShipmentsById);

export default router;
