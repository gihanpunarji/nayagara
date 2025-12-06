const User = require("../models/User");
const AdminDashboard = require("../models/AdminDashboard");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const Bank = require("../models/Bank");
const Payment = require("../models/Payment");
const SellerEarning = require("../models/SellerEarning");
const { uploadCategoryIcon } = require("../utils/cloudinaryUpload");

const getAdminProfile = async (req, res) => {
  // Placeholder for admin profile logic
  res.json({ success: true, message: "Admin profile data" });
};

const updateAdminProfile = async (req, res) => {
  // Placeholder for admin profile update logic
  res.json({ success: true, message: "Admin profile updated" });
};

const getCustomers = async (req, res) => {
  try {
    const customers = await User.getAllCustomersWithStats();
    res.json({ success: true, customers });
  } catch (error) {
    console.error("Error fetching all customers:", error);
    res.status(500).json({ success: false, message: "Failed to fetch customers" });
  }
};

const getSellers = async (req, res) => {
  try {
    const sellers = await User.getAllSellersWithStats();
    res.json({ success: true, sellers });
  } catch (error) {
    console.error("Error fetching all sellers:", error);
    res.status(500).json({ success: false, message: "Failed to fetch sellers" });
  }
};

const getAdminDashboardData = async (req, res) => {
  try {
    const stats = await AdminDashboard.getAdminStats();
    const recentActivities = await AdminDashboard.getRecentActivities();
    const systemHealth = await AdminDashboard.getSystemHealth();

    const dashboardData = {
      ...stats,
      recentActivities,
      systemHealth,
    };

    res.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500).json({ success: false, message: "Failed to fetch admin dashboard data" });
  }
};

const getAdminCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategoriesWithStats();

    // Get subcategories for each category
    const categoriesWithSubcategories = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await SubCategory.findByCategoryId(category.id);
        return {
          ...category,
          status: category.is_active ? 'active' : 'inactive',
          subCategories: subcategories.map(sub => sub.sub_category_name),
          totalProducts: parseInt(category.total_products) || 0,
          activeProducts: parseInt(category.active_products) || 0,
          totalSales: parseFloat(category.total_sales) || 0,
          subcategory_count: parseInt(category.subcategory_count) || 0,
          icon: category.icon || null,
          icon_image: category.image || null
        };
      })
    );

    res.json({ success: true, categories: categoriesWithSubcategories });
  } catch (error) {
    console.error("Error fetching admin categories:", error);
    res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
};

const addCategory = async (req, res) => {
  try {
    const { categoryName, categorySlug } = req.body;

    if (!categoryName || !categorySlug) {
      return res.status(400).json({
        success: false,
        message: "Category name and slug are required"
      });
    }

    let imageUrl = null;
    let iconUrl = null;

    // If an image was uploaded, upload to Cloudinary (this goes to 'image' column)
    if (req.files && req.files['icon'] && req.files['icon'][0]) {
      try {
        imageUrl = await uploadCategoryIcon(
          req.files['icon'][0].buffer,
          req.files['icon'][0].originalname,
          categorySlug
        );
      } catch (uploadError) {
        console.error("Error uploading category image:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload category image"
        });
      }
    }

    // If an .ico file was uploaded, upload to Cloudinary (this goes to 'icon' column)
    if (req.files && req.files['icoFile'] && req.files['icoFile'][0]) {
      try {
        iconUrl = await uploadCategoryIcon(
          req.files['icoFile'][0].buffer,
          req.files['icoFile'][0].originalname,
          `${categorySlug}_ico`
        );
      } catch (uploadError) {
        console.error("Error uploading .ico file:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload .ico file"
        });
      }
    }

    // Create category
    const result = await Category.create({
      categoryName,
      categorySlug,
      icon: iconUrl,        // .ico file goes to icon column
      icoFile: imageUrl,    // image file goes to image column
      isActive: 1
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        id: result.insertId,
        name: categoryName,
        slug: categorySlug,
        icon: iconUrl,
        image: imageUrl
      }
    });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add category",
      error: error.message
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { categoryName, categorySlug } = req.body;

    if (!categoryName || !categorySlug) {
      return res.status(400).json({
        success: false,
        message: "Category name and slug are required"
      });
    }

    // Get existing category to check what needs to be updated
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    let iconUrl = existingCategory.icon;      // .ico file
    let imageUrl = existingCategory.image;    // regular image

    // If a new image was uploaded, upload to Cloudinary (this goes to 'image' column)
    if (req.files && req.files['icon'] && req.files['icon'][0]) {
      try {
        imageUrl = await uploadCategoryIcon(
          req.files['icon'][0].buffer,
          req.files['icon'][0].originalname,
          categorySlug
        );
      } catch (uploadError) {
        console.error("Error uploading category image:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload category image"
        });
      }
    }

    // If a new .ico file was uploaded, upload to Cloudinary (this goes to 'icon' column)
    if (req.files && req.files['icoFile'] && req.files['icoFile'][0]) {
      try {
        iconUrl = await uploadCategoryIcon(
          req.files['icoFile'][0].buffer,
          req.files['icoFile'][0].originalname,
          `${categorySlug}_ico`
        );
      } catch (uploadError) {
        console.error("Error uploading .ico file:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload .ico file"
        });
      }
    }

    // Update category
    const result = await Category.update({
      categoryId,
      categoryName,
      categorySlug,
      icon: iconUrl,        // .ico file goes to icon column
      iconImage: imageUrl,  // image file goes to image column
      isActive: existingCategory.is_active
    });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found or no changes made"
      });
    }

    res.json({
      success: true,
      message: "Category updated successfully",
      data: {
        id: categoryId,
        name: categoryName,
        slug: categorySlug,
        icon: iconUrl,
        image: imageUrl
      }
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message
    });
  }
};

const addSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategoryName } = req.body;

    if (!categoryId || !subCategoryName) {
      return res.status(400).json({
        success: false,
        message: "Category ID and subcategory name are required"
      });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Create subcategory
    const result = await SubCategory.create({
      categoryId,
      subCategoryName
    });

    res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      data: {
        id: result.insertId,
        name: subCategoryName,
        categoryId
      }
    });
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add subcategory",
      error: error.message
    });
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;

    if (!subcategoryId) {
      return res.status(400).json({
        success: false,
        message: "Subcategory ID is required"
      });
    }

    // Check if subcategory has products
    const hasProducts = await SubCategory.hasProducts(subcategoryId);
    if (hasProducts) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete subcategory because it has products associated with it"
      });
    }

    // Delete subcategory
    const result = await SubCategory.delete(subcategoryId);

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found"
      });
    }

    res.json({
      success: true,
      message: "Subcategory deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting subcategory:", error);

    // Check if error is a foreign key constraint
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        success: false,
        message: "Cannot delete subcategory because it has products associated with it"
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete subcategory",
      error: error.message
    });
  }
};

const toggleCategoryStatus = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required"
      });
    }

    // Get current category status (including inactive ones)
    const category = await Category.findByIdIncludingInactive(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Toggle status (1 to 0 or 0 to 1)
    const newStatus = category.is_active === 1 ? 0 : 1;

    // Update category status
    const result = await Category.updateStatus(categoryId, newStatus);

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.json({
      success: true,
      message: `Category ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: categoryId,
        is_active: newStatus
      }
    });
  } catch (error) {
    console.error("Error toggling category status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category status",
      error: error.message
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required"
      });
    }

    // Check if category has subcategories
    const subcategories = await SubCategory.findByCategoryId(categoryId);
    if (subcategories.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete category because it has subcategories. Please delete all subcategories first."
      });
    }

    // Check if category has products
    const hasProducts = await Category.hasProducts(categoryId);
    if (hasProducts) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete category because it has products associated with it. Please remove or reassign the products first."
      });
    }

    // Delete category (soft delete by setting is_active to 0)
    const result = await Category.delete(categoryId);

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting category:", error);

    // Check if error is a foreign key constraint
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        success: false,
        message: "Cannot delete category because it has related data (subcategories or products)"
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message
    });
  }
};

const getSellerBankDetails = async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required"
      });
    }

    // Check if seller exists
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found"
      });
    }

    // Get bank details
    const bankDetails = await Bank.findByUserId(sellerId);

    if (!bankDetails) {
      return res.json({
        success: true,
        data: null,
        message: "No bank details found for this seller"
      });
    }

    res.json({
      success: true,
      data: bankDetails
    });
  } catch (error) {
    console.error("Error fetching seller bank details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bank details",
      error: error.message
    });
  }
};

const getSellerEarnings = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Check if seller exists
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found"
      });
    }

    // Get seller's orders
    const orders = await SellerEarning.getSellerOrders(sellerId);
    const paymentHistory = await SellerEarning.getPaymentHistory(sellerId);
    const stats = await SellerEarning.getStats(sellerId);

    res.json({
      success: true,
      data: {
        orders,
        paymentHistory,
        stats
      }
    });
  } catch (error) {
    console.error("Error fetching seller earnings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch seller earnings",
      error: error.message
    });
  }
};

const recordPayment = async (req, res) => {
  try {
    const { sellerId, earningIds } = req.body;

    if (!sellerId || !earningIds || !Array.isArray(earningIds) || earningIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Seller ID and earning IDs are required"
      });
    }

    // Check if seller exists
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found"
      });
    }

    // Validate earnings belong to seller and are unpaid
    const earnings = await SellerEarning.getByIds(earningIds);
    const invalidEarnings = earnings.filter(e => e.seller_id !== parseInt(sellerId) || e.payment_status !== 'unpaid');

    if (invalidEarnings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some earnings are invalid or already paid"
      });
    }

    // Calculate total amount
    const totalAmount = await SellerEarning.calculateTotal(earningIds);

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Total amount must be greater than 0"
      });
    }

    // Create payment record
    const result = await Payment.create({
      userId: sellerId,
      amount: totalAmount
    });

    // Mark earnings as paid
    await SellerEarning.markAsPaid(earningIds, result.insertId);

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      data: {
        paymentId: result.insertId,
        amount: totalAmount,
        ordersCount: earningIds.length,
        sellerId
      }
    });
  } catch (error) {
    console.error("Error recording payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to record payment",
      error: error.message
    });
  }
};

module.exports = {
  getAdminProfile,
  updateAdminProfile,
  getCustomers,
  getSellers,
  getAdminDashboardData,
  getAdminCategories,
  addCategory,
  updateCategory,
  addSubCategory,
  deleteSubCategory,
  toggleCategoryStatus,
  deleteCategory,
  getSellerBankDetails,
  getSellerEarnings,
  recordPayment,
};