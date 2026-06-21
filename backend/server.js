import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import mpesaRoutes from './routes/mpesa.routes.js';
import { WAClient } from './services/whatsapp.service.js';
import systemLogger from './services/logger.service.js';


const port = process.env.PORT;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(systemLogger.getRequestLogger())


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/mpesa', mpesaRoutes);

// Connect to Whatsapp
await WAClient.connect();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    systemLogger.info(`Server running on port ${PORT}`)
});

