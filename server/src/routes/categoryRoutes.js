const express = require("express");
const { 
  getAllCategories, 
  getSubCategories, 
  getCategoryFields, 
  getCategoryStructure 
} = require("../controllers/categoryController");
const router = express.Router();

// Get all categories
router.get("/categories", getAllCategories);

// Get subcategories by category ID
router.get("/categories/:categoryId/subcategories", getSubCategories);

// Get category fields by subcategory ID
router.get("/subcategories/:subCategoryId/fields", getCategoryFields);

// Get complete category structure
router.get("/category-structure", getCategoryStructure);

module.exports = router;
