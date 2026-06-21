import db from "../config/db.js";
import aiService from "./ai.service.js";
class BookingService {
    constructor() {
        this.aiService = aiService;
    }

    async createBooking(userId, data) {
        const sql = `INSERT INTO bookings (user_id, service_type, device, description, phone, status) VALUES (?, ?, ?, ?, ?, 'pending')`;
        const result = await db.query(sql, [userId, data.serviceType, data.device, data.description, data.phone]);
        
        // Asynchronous AI & WhatsApp logic
        this.aiService.generateAutomatedResponse(data).then(msg => {
            this.aiService.sendWhatsAppMessage(data.phone, msg); // Message to Client
            this.aiService.sendWhatsAppMessage(process.env.ADMIN_PHONE, `NEW BOOKING ALERT! Service: ${data.serviceType}, Device: ${data.device}`); // Message to Admin
        });

        return result.insertId;
    }

    async getAdminStats() {
        const bookings = await db.query(`SELECT COUNT(*) as total FROM bookings`);
        const pending = await db.query(`SELECT COUNT(*) as pending FROM bookings WHERE status = 'pending'`);
        const recent = await db.query(`
            SELECT b.*, u.name as user_name 
            FROM bookings b JOIN users u ON b.user_id = u.id 
            ORDER BY b.created_at DESC LIMIT 5
        `);
        
        return {
            totalBookings: bookings[0].total,
            pendingRepairs: pending[0].pending,
            recent: recent
        };
    }
}


const bookingService = new BookingService();

export default bookingService;