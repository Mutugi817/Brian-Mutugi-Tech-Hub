import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import bookingsController from '../controllers/bookings.controller.js';

const router = Router();

router.post('/', authenticateToken, bookingsController.bookings);

export default router;