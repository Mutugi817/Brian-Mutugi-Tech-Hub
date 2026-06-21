import db from "../config/db.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthService {
    async registerUser(name, email, password) {
        const existingUser = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
        if (existingUser.length > 0) {
            throw new Error("Email is already in use.")
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        const result = await db.query(sql, [name, email, hashedPassword]);
        
        console.log(`[System Email]: Verification link sent to ${email}`);
        return { message: "User registered successfully! Please sign in." };
    }

    async loginUser(email, password) {
        const users = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
        if (users.length === 0) {
            throw new Error("Invalid credentials.");
            return;
        }
        
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword){
            
            throw new Error("Invalid credentials.");
            return;
        }
        // Generate Token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        // Remove password before sending to client
        delete user.password;
        return { token, user };
    }
}

const authService = new AuthService();

export default authService;