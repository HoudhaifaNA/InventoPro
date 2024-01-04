import express from 'express';

import { createShipment, deleteShipmentsById, getShipments, updateShipment } from '../controllers/shipmentsController';

const router = express.Router();

router.route('/').get(getShipments).post(createShipment);
router.route('/:id').patch(updateShipment).delete(deleteShipmentsById);

export default router;
