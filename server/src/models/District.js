const { getConnection } = require("../config/database");

class District {
    static async getAllProvinces() {
        const connection = getConnection();
        const [rows] = await connection.execute('SELECT province_id, province_name FROM provinces ORDER BY province_name');
        return rows;
    }

    static async getAllDistricts() {
        const connection = getConnection();
        const [rows] = await connection.execute('SELECT district_name FROM districts');
        return rows;
    }

    static async getDistrictsByProvince(provinceId) {
        const connection = getConnection();
        const [rows] = await connection.execute(
            'SELECT district_id, district_name FROM districts WHERE province_id = ? ORDER BY district_name',
            [provinceId]
        );
        return rows;
    }

    static async getCitiesByDistrict(districtId) {
        const connection = getConnection();
        const [rows] = await connection.execute(
            'SELECT city_id,city_name FROM cities WHERE district_id = ? ORDER BY city_name',
            [districtId]
        );
        return rows;
    }

}

module.exports = District;