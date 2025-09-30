const Category = require("../models/Category");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found",
      });
    }
    // console.log(categories);
    

    res.json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
    });
  }
};

module.exports = { getAllCategories };
