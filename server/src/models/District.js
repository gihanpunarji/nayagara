const { getConnection } = require("../config/database");

class District {
    static async getAllDistricts() {
        const connection = getConnection();
        const [rows] = await connection.execute('SELECT district_name FROM districts');
        return rows;
    }

}

module.exports = District;