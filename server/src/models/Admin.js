const { getConnection } = require("../config/database");
const bcrypt = require("bcrypt");

class Admin {
    static async checkAdmin(email) {        
        const connection = getConnection();
        const [rows] = await connection.execute("SELECT * FROM admins WHERE admin_email = ?", [email]);        
        return rows[0];
    }

    static async comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
}

module.exports = Admin;