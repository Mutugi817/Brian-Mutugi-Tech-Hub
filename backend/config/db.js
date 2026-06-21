import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs';

class Database {
    constructor() {
        if(!Database.instance) {
            this.pool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                waitForConnections: true,
                queueLimit: 0
            })
            Database.instance = this;
            this.initDB();
        }
        return Database.instance;
    }

    async query(sql, params) {
        const [rows] = await this.pool.execute(sql, params);
        return rows;
    }

    async initDB() {
        try {
            await this.query(`
                CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                password VARCHAR(255), 
                role VARCHAR(50) DEFAULT 'client',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
            
            await this.query(`
                CREATE TABLE IF NOT EXISTS bookings (
                    id INT AUTO_INCREMENT PRIMARY KEY, 
                    user_id INT, 
                    service_type VARCHAR(100), 
                    device VARCHAR(255), 
                    description TEXT, 
                    phone VARCHAR(50), 
                    status VARCHAR(50) DEFAULT 'pending', 
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            const adminHash = await bcrypt.hash('redeemed', 10);
            await this.query(`INSERT IGNORE INTO users (name, email, password, role) VALUES ('Brian Mutugi', 'admin@mutugihub.com', ?, 'admin')`, [adminHash]);
            console.log("Database tables checked and initialized.");
        } catch (error) {
            console.error("Database Initialization failed:", error.message);
        }
    }
}

const db = new Database();

export default db;