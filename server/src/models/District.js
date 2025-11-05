const { getConnection } = require("../config/database");

class District {
    static async getAllProvinces() {
        const pool = getConnection();
        let connection;
        try {
            connection = await pool.getConnection();
            const [rows] = await connection.execute('SELECT province_id, province_name FROM provinces ORDER BY province_name');
            return rows;
        } finally {
            if (connection) connection.release();
        }
    }

    static async getAllDistricts() {
        const pool = getConnection();
        let connection;
        try {
            connection = await pool.getConnection();
            const [rows] = await connection.execute('SELECT district_name FROM districts');
            return rows;
        } finally {
            if (connection) connection.release();
        }
    }

    static async getDistrictsByProvince(provinceId) {
        const pool = getConnection();
        let connection;
        try {
            connection = await pool.getConnection();
            const [rows] = await connection.execute(
                'SELECT district_id, district_name FROM districts WHERE province_id = ? ORDER BY district_name',
                [provinceId]
            );
            return rows;
        } finally {
            if (connection) connection.release();
        }
    }

    static async getCitiesByDistrict(districtId) {
        const pool = getConnection();
        let connection;
        try {
            connection = await pool.getConnection();
            const [rows] = await connection.execute(
                'SELECT city_id,city_name FROM cities WHERE district_id = ? ORDER BY city_name',
                [districtId]
            );
            return rows;
        } finally {
            if (connection) connection.release();
        }
    }

}

module.exports = District;