import authService from "../services/auth.service.js";

const authController = {
    async signup(req, res) {
        try {
            const {name, email, password} = req.body;
            const response = await authService.registerUser(name, email, password);
            res.status(201).json(response)
        } catch (error) {
        res.status(400).json({ error: error.message });
        console.error(error.message)
    }
    },

    async signin(req, res) {
        try {
            const { email, password } = req.body;
            const response = await authService.loginUser(email, password);
            res.status(200).json(response);
    } catch (error) {
            res.status(401).json({ error: error.message });
            console.error(error.message)
    }
    }
}

export default authController;