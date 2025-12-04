const User = require("../models/User");
const AdminDashboard = require("../models/AdminDashboard");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
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

    let iconUrl = null;
    let icoFileUrl = null;

    // If an image was uploaded, upload to Cloudinary
    if (req.files && req.files['icon'] && req.files['icon'][0]) {
      try {
        iconUrl = await uploadCategoryIcon(
          req.files['icon'][0].buffer,
          req.files['icon'][0].originalname,
          categorySlug
        );
      } catch (uploadError) {
        console.error("Error uploading category icon:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload category icon"
        });
      }
    }

    // If an .ico file was uploaded, upload to Cloudinary
    if (req.files && req.files['icoFile'] && req.files['icoFile'][0]) {
      try {
        icoFileUrl = await uploadCategoryIcon(
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
      icon: iconUrl,
      icoFile: icoFileUrl,
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
        icoFile: icoFileUrl
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

module.exports = {
  getAdminProfile,
  updateAdminProfile,
  getCustomers,
  getSellers,
  getAdminDashboardData,
  getAdminCategories,
  addCategory,
};