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
    console.log("unit price ", unit_price);
    
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
      `SELECT oi.*, pi.image_url as product_image_url 
      FROM order_items oi
      LEFT JOIN product_images pi ON oi.product_id = pi.product_id AND pi.is_primary = 1
      WHERE oi.order_id = ?
      GROUP BY oi.order_item_id`,
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

  static async getSellerOrders(seller_id) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT DISTINCT
        o.order_id,
        o.order_number,
        o.order_status,
        o.payment_status,
        o.order_datetime,
        o.total_amount,
        u.first_name as customer_first_name,
        u.last_name as customer_last_name,
        u.user_mobile as customer_mobile,
        u.user_email as customer_email,
        osa.line1 as shipping_line1,
        osa.line2 as shipping_line2,
        osa.city_name as shipping_city,
        osa.district_name as shipping_district,
        osa.province_name as shipping_province,
        osa.postal_code as shipping_postal_code,
        osa.country_name as shipping_country
       FROM orders o
       JOIN order_items oi ON o.order_id = oi.order_id
       LEFT JOIN users u ON o.customer_id = u.user_id
       LEFT JOIN order_shipping_addresses osa ON o.shipping_address_id = osa.shipping_address_id
       WHERE oi.seller_id = ?
       ORDER BY o.order_datetime DESC`,
      [seller_id]
    );
    return rows;
  }

  static async getSellerOrderItems(seller_id) {
    const connection = getConnection();
    const [rows] = await connection.execute(
      `SELECT oi.*, o.order_number, o.order_status, o.payment_status, o.order_datetime
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.order_id
       WHERE oi.seller_id = ? 
       ORDER BY o.order_datetime DESC`,
      [seller_id]
    );
    console.log(rows);
    return rows;
  }

  static async updateOrderItemStatus(order_item_id, status, tracking_number = null) {
    const connection = getConnection();
    let query = `UPDATE order_items SET order_status = ?`;
    let params = [status];

    if (tracking_number) {
      query += `, tracking_number = ?`;
      params.push(tracking_number);
    }

    query += ` WHERE order_item_id = ?`;
    params.push(order_item_id);

    const [result] = await connection.execute(query, params);
    return result.affectedRows;
  }

  static async updateOrderStatus(order_id, status, tracking_number = null) {
    const connection = getConnection();
    let query = `UPDATE orders SET order_status = ?`;
    let params = [status];

    if (tracking_number) {
      query += `, tracking_number = ?`;
      params.push(tracking_number);
    }

    query += ` WHERE order_id = ?`;
    params.push(order_id);

    const [result] = await connection.execute(query, params);
    return result.affectedRows;
  }

  static async addDiscount(orderId, discountToAdd) {
    const connection = getConnection();
    try {
      await connection.beginTransaction();

      const [rows] = await connection.execute("SELECT discount_amount, total_amount FROM orders WHERE order_id = ? FOR UPDATE", [orderId]);
      const order = rows[0];

      if (!order) {
        throw new Error(`Order with ID ${orderId} not found.`);
      }

      const newDiscountAmount = parseFloat(order.discount_amount) + parseFloat(discountToAdd);
      const newTotalAmount = parseFloat(order.total_amount) - parseFloat(discountToAdd);

      const [result] = await connection.execute(
        "UPDATE orders SET discount_amount = ?, total_amount = ? WHERE order_id = ?",
        [newDiscountAmount, newTotalAmount, orderId]
      );

      await connection.commit();
      return result.affectedRows;

    } catch (error) {
      const connection = getConnection();
      await connection.rollback();
      console.error(`Failed to add discount to order ${orderId}:`, error);
      throw error;
    }
  }

  static async getAllOrders({ page = 1, limit = 25 }) {
    const connection = getConnection();
    const offset = (page - 1) * parseInt(limit);

    // Get total count
    const countResult = await connection.execute("SELECT COUNT(*) as total FROM orders");
    const total = countResult[0][0].total;
    
    // Get paginated orders
    const [rows] = await connection.execute(
      `SELECT 
        o.*,
        u.first_name as customer_first_name,
        u.last_name as customer_last_name,
        u.user_email as customer_email,
        u.user_mobile as customer_phone,
        osa.line1 as shipping_address_line1,
        osa.city_name as shipping_city
       FROM orders o
       LEFT JOIN users u ON o.customer_id = u.user_id
       LEFT JOIN order_shipping_addresses osa ON o.shipping_address_id = osa.shipping_address_id
       ORDER BY o.order_datetime DESC
       LIMIT ? OFFSET ?`,
      [parseInt(limit), offset]
    );

    return {
        orders: rows,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: total,
            totalPages: Math.ceil(total / parseInt(limit))
        }
    };
  }

  static async getOrderItemsForMultipleOrders(orderIds) {
    if (orderIds.length === 0) return [];
    const connection = getConnection();
    const placeholders = orderIds.map(() => '?').join(',');
    
    const [rows] = await connection.execute(
      `SELECT 
        oi.*,
        s_user.first_name as seller_first_name,
        s_user.last_name as seller_last_name,
        st.store_name as seller_store_name
       FROM order_items oi
       LEFT JOIN users s_user ON oi.seller_id = s_user.user_id
       LEFT JOIN store st ON oi.seller_id = st.user_id
       WHERE oi.order_id IN (${placeholders})`,
      orderIds
    );
    return rows;
  }
}

module.exports = Order;