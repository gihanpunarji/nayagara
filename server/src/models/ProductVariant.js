const { getConnection } = require("../config/database");

class ProductVariant {
    static async create({
        productId,
        price,
        stockQuantity,
        sku,
        attributes,
        imageUrl
    }) {
        const connection = getConnection();
        const [result] = await connection.execute(
            `INSERT INTO product_variants (
        product_id, price, stock_quantity, sku, attributes, image_url
      ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                productId,
                price,
                stockQuantity,
                sku || null,
                JSON.stringify(attributes || {}),
                imageUrl || null
            ]
        );
        return result;
    }

    static async createMultiple(productId, variantsData) {
        if (!variantsData || variantsData.length === 0) return;

        // Process each variant one by one (could be optimized with bulk INSERT if needed)
        for (const variant of variantsData) {
            await this.create({
                productId,
                ...variant
            });
        }
    }

    static async findByProductId(productId) {
        const connection = getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM product_variants WHERE product_id = ?",
            [productId]
        );

        return rows.map(row => ({
            ...row,
            attributes: typeof row.attributes === 'string' ? JSON.parse(row.attributes) : row.attributes
        }));
    }

    static async update({
        variantId,
        price,
        stockQuantity,
        sku,
        attributes,
        imageUrl
    }) {
        const connection = getConnection();
        const [result] = await connection.execute(
            `UPDATE product_variants SET
        price = ?, stock_quantity = ?, sku = ?, attributes = ?, image_url = ?
       WHERE variant_id = ?`,
            [
                price,
                stockQuantity,
                sku || null,
                JSON.stringify(attributes || {}),
                imageUrl || null,
                variantId
            ]
        );
        return result.affectedRows;
    }

    static async delete(variantId) {
        const connection = getConnection();
        const [result] = await connection.execute(
            "DELETE FROM product_variants WHERE variant_id = ?",
            [variantId]
        );
        return result.affectedRows;
    }

    static async deleteByProductId(productId) {
        const connection = getConnection();
        const [result] = await connection.execute(
            "DELETE FROM product_variants WHERE product_id = ?",
            [productId]
        );
        return result.affectedRows;
    }
}

module.exports = ProductVariant;
