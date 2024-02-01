import express from 'express';
import { getStats, getStock } from '../controllers/statsController';

const router = express.Router();

router.get('/stock', getStock);
router.get('/', getStats);

export default router;
