import bookingService from "../services/booking.service.js";

const bookingsController = {
    async bookings(req, res) {
        try {
        const bookingId = await bookingService.createBooking(req.user.id, req.body);
        res.status(201).json({ success: true, bookingId });
    } catch (error) {
        res.status(500).json({ error: "Failed to create booking." });
        console.error(error)
    }
    }
}

export default bookingsController;