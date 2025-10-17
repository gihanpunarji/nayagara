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

    static async getBusinessAddressByUserId(userId) {
        const connection = getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM addresses WHERE user_id = ? AND address_type = 'seller_business' LIMIT 1",
            [userId]
        );
        return rows[0];
    }

    static async getCompleteBusinessAddressByUserId(userId) {
        const connection = getConnection();
        const [rows] = await connection.execute(
            `SELECT 
                a.*, 
                c.city_name,
                d.district_name,
                p.province_name,
                co.country_name
            FROM addresses a
            LEFT JOIN cities c ON a.city_id = c.city_id
            LEFT JOIN districts d ON c.district_id = d.district_id  
            LEFT JOIN provinces p ON d.province_id = p.province_id
            LEFT JOIN countries co ON p.country_id = co.country_id
            WHERE a.user_id = ? AND a.address_type = 'seller_business' 
            LIMIT 1`,
            [userId]
        );
        return rows[0];
    }

    static async updateBusinessAddress({ userId, line1, line2, postalCode, cityId }) {
        const connection = getConnection();
        const [result] = await connection.execute(
            "UPDATE addresses SET line1 = ?, line2 = ?, postalCode = ?, city_id = ?, updated_at = ? WHERE user_id = ? AND address_type = 'business'",
            [line1, line2, postalCode, cityId, new Date(), userId]
        );
        return result.affectedRows;
    }

    static async createOrUpdateBusinessAddress({ userId, line1, line2, postalCode, cityId }) {
        const existingAddress = await this.getBusinessAddressByUserId(userId);
        
        if (existingAddress) {
            return await this.updateBusinessAddress({ userId, line1, line2, postalCode, cityId });
        } else {
            return await this.createAddressForSeller({
                userId,
                addressType: 'business',
                line1,
                line2,
                postalCode,
                cityId: cityId || null,
                isDefault: true,
                isActive: true
            });
        }
    }

    static async getUserAddresses(userId) {
        const connection = getConnection();
        const [rows] = await connection.execute(
            `SELECT 
                a.*, 
                c.city_name,
                d.district_name, 
                d.district_id,
                p.province_name,
                p.province_id,
                co.country_name
            FROM addresses a
            LEFT JOIN cities c ON a.city_id = c.city_id
            LEFT JOIN districts d ON c.district_id = d.district_id  
            LEFT JOIN provinces p ON d.province_id = p.province_id
            LEFT JOIN countries co ON p.country_id = co.country_id
            WHERE a.user_id = ? AND a.is_active = 1
            ORDER BY a.is_default DESC`,
            [userId]
        );
        return rows;
    }

    static async createUserAddress({ userId, addressType = 'billing', line1, line2, postalCode, cityId, isDefault = false }) {
        const connection = getConnection();
        
        // If this is set as default, make sure to unset other defaults first
        if (isDefault) {
            await connection.execute(
                "UPDATE addresses SET is_default = 0 WHERE user_id = ? AND address_type = ?",
                [userId, addressType]
            );
        }
        
        const [result] = await connection.execute(
            "INSERT INTO addresses (user_id, address_type, line1, line2, postal_code, city_id, is_default, is_active, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [userId, addressType, line1, line2, postalCode, cityId, isDefault ? 1 : 0, 1, new Date()]
        );
        return result;
    }

    static async updateUserAddress({ addressId, userId, line1, line2, postalCode, cityId, isDefault }) {
        const connection = getConnection();
        
        // If this is set as default, make sure to unset other defaults first
        if (isDefault) {
            await connection.execute(
                "UPDATE addresses SET is_default = 0 WHERE user_id = ? AND address_id != ?",
                [userId, addressId]
            );
        }
        
        const [result] = await connection.execute(
            "UPDATE addresses SET line1 = ?, line2 = ?, postal_code = ?, city_id = ?, is_default = ?, updated_at = ? WHERE address_id = ? AND user_id = ?",
            [line1, line2, postalCode, cityId, isDefault ? 1 : 0, new Date(), addressId, userId]
        );
        return result.affectedRows;
    }

    static async deleteUserAddress(addressId, userId) {
        const connection = getConnection();
        const [result] = await connection.execute(
            "UPDATE addresses SET is_active = 0, updated_at = ? WHERE address_id = ? AND user_id = ?",
            [new Date(), addressId, userId]
        );
        return result.affectedRows;
    }
}


module.exports = Address;