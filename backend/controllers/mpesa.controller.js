const mpesaController = {

    async sendSTKPush(req, res) {
        // Safaricom Daraja API logic

        res.status(200).json({ success: true, message: `STK Push triggered for ${req.body.phone}` });
    }
}

export default mpesaController;