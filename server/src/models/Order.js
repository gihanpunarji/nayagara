const { getConnection } = require("../config/database");

class Order {
  static async createOrder({
    order_number,
    customer_id,
    shipping_address_id,
    subtotal,
    shipping_cost,
    tax_amount = 0,
    discount_amount = 0,
    total_amount,
    order_status = 'pending',
    payment_status = 'pending'
  }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      `INSERT INTO orders (
        order_number, customer_id, shipping_address_id, subtotal, 
        shipping_cost, tax_amount, discount_amount, total_amount, 
        order_status, payment_status, order_datetime
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        order_number, customer_id, shipping_address_id, subtotal,
        shipping_cost, tax_amount, discount_amount, total_amount,
        order_status, payment_status
      ]
    );
    return result.insertId;
  }

  static async createShippingAddress({
    line1,
    line2,
    postal_code,
    city_name,
    district_name,
    province_name,
    country_name
  }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      `INSERT INTO order_shipping_addresses (
        line1, line2, postal_code, city_name, 
        district_name, province_name, country_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [line1, line2, postal_code, city_name, district_name, province_name, country_name]
    );
    return result.insertId;
  }

  static async createOrderItem({
    order_id,
    product_id,
    seller_id,
    product_title,
    product_description,
    unit_price,
    quantity,
    total_price,
    product_attributes_snapshot,
    product_image_url
  }) {
    const connection = getConnection();
    const [result] = await connection.execute(
      `INSERT INTO order_items (
        order_id, product_id, seller_id, product_title, 
        product_description, unit_price, quantity, total_price,
        product_attributes_snapshot, product_image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_id, product_id, seller_id, product_title,
        product_description, unit_price, quantity, total_price,
        product_attributes_snapshot, product_image_url
      ]
    );
    return result.insertId;
  }

  static async updateOrderPaymentStatus(order_id, payment_status) {
    const connection = getConnection();
    const [result] = await connection.execute(
      `UPDATE orders SET payment_status = ?, confirmed_at = NOW() WHERE order_id = ?`,
      [payment_status, order_id]
    );
    return result.affectedRows;
  }

  static async updateOrderStatus(order_id, order_status) {
    const connection = getConnection();
    const [result] = await connection.execute(
      `UPDATE orders SET order_status = ? WHERE order_id = ?`,
      [order_status, order_id]
    );
    return result.affectedRows;
  }

  static async getOrderByNumber(order_number) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT o.*, osa.* FROM orders o 
       LEFT JOIN order_shipping_addresses osa ON o.shipping_address_id = osa.shipping_address_id 
       WHERE o.order_number = ?`,
      [order_number]
    );
    return rows[0];
  }

  static async getOrderItems(order_id) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [order_id]
    );
    return rows;
  }

  static async getUserOrders(customer_id) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT o.*, osa.* FROM orders o 
       LEFT JOIN order_shipping_addresses osa ON o.shipping_address_id = osa.shipping_address_id 
       WHERE o.customer_id = ? 
       ORDER BY o.order_datetime DESC`,
      [customer_id]
    );
    return rows;
  }
}

module.exports = Order;