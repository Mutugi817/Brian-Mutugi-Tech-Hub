import bookingService from "../services/booking.service.js"

const adminController = {
    async getStats(req, res) {
        try {
            const stats = await bookingService.getAdminStats();
            res.status(200).json(stats);
        } catch (error) {
            res.status(500).json({error: 'Failed to fetch stats.'});
        }
    }
}

export default adminController;