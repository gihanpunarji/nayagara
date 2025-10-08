const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const CategoryField = require("../models/CategoryField");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found",
      });
    }

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

// Get subcategories by category ID
const getSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required"
      });
    }

    const subCategories = await SubCategory.findByCategoryId(categoryId);
    
    res.json({
      success: true,
      message: "Subcategories fetched successfully",
      data: subCategories
    });
  } catch (error) {
    console.error("Get subcategories error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get category fields by subcategory ID
const getCategoryFields = async (req, res) => {
  try {
    const { subCategoryId } = req.params;
    
    if (!subCategoryId) {
      return res.status(400).json({
        success: false,
        message: "Subcategory ID is required"
      });
    }

    const fields = await CategoryField.findBySubCategoryId(subCategoryId);
    
    // Parse field options for each field
    const parsedFields = fields.map(field => ({
      ...field,
      field_options: CategoryField.parseFieldOptions(field.field_options)
    }));
    
    res.json({
      success: true,
      message: "Category fields fetched successfully",
      data: parsedFields
    });
  } catch (error) {
    console.error("Get category fields error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get complete category structure (categories with subcategories and fields)
const getCategoryStructure = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    
    const categoryStructure = await Promise.all(
      categories.map(async (category) => {
        const subCategories = await SubCategory.findByCategoryId(category.category_id);
        
        const subCategoriesWithFields = await Promise.all(
          subCategories.map(async (subCategory) => {
            const fields = await CategoryField.findBySubCategoryId(subCategory.sub_category_id);
            
            // Parse field options for each field
            const parsedFields = fields.map(field => ({
              ...field,
              field_options: CategoryField.parseFieldOptions(field.field_options)
            }));
            
            return {
              ...subCategory,
              fields: parsedFields
            };
          })
        );
        
        return {
          ...category,
          sub_categories: subCategoriesWithFields
        };
      })
    );
    
    res.json({
      success: true,
      message: "Category structure fetched successfully",
      data: categoryStructure
    });
  } catch (error) {
    console.error("Get category structure error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = { 
  getAllCategories, 
  getSubCategories, 
  getCategoryFields, 
  getCategoryStructure 
};
