import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import mpesaController from "../controllers/mpesa.controller.js";

const router = Router();

router.post('/mpesa', authenticateToken, mpesaController.sendSTKPush);

export default router;