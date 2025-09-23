const { getConnection } = require("../config/database");

class Address {
    static async createAddressForSeller({ userId, addressType, line1, line2, postalCode, cityId, isDefault, isActive }) {
        const connection = getConnection();
        const [ result ] = await connection.execute(
            "INSERT INTO addresses (user_id, address_type, line1, line2, postal_code, city_id, is_default, is_active, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [userId, addressType, line1, line2, postalCode, cityId, isDefault ? 1 : 0, isActive ? 1 : 0, new Date()]
        );
        return result;
    }
}

module.exports = Address;