import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ mainCategories }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category.slug || category.name.toLowerCase())}`);
  };

  const handleSubcategoryClick = (category, subcategory) => {
    navigate(`/shop?category=${encodeURIComponent(category.slug || category.name.toLowerCase())}&subcategory=${encodeURIComponent(subcategory.sub_category_id)}`);
  };

  return (
    <>
      {/* Desktop Sidebar - Only show on XL screens and up */}
      <div className="hidden xl:block w-64">
        <div className="bg-white rounded-lg shadow-green p-4">
          <h3 className="font-heading font-bold text-lg mb-4 text-gray-800">Shop by Category</h3>
          <div className="space-y-2">
            {mainCategories.map((category, idx) => (
              <div key={idx} className="relative group">
                <div
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="flex items-center space-x-3">
                    {category.icon && category.icon.startsWith('http') ? (
                      <img src={category.icon} alt={category.name} className="w-6 h-6 object-contain rounded" />
                    ) : (
                      <span className="text-lg">{category.icon}</span>
                    )}
                    <span className="font-medium text-gray-700 hover:text-primary-600">{category.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 hover:text-primary-500" />
                </div>

                {/* Subcategory Dropdown */}
                <div className="hidden group-hover:block absolute left-full top-0 ml-4 w-80 bg-white border border-gray-200 rounded-lg shadow-2xl p-6 z-50">
                  <h4 className="font-bold text-gray-800 mb-4 text-lg">{category.name}</h4>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {category.subcategories && category.subcategories.length > 0 ? (
                      category.subcategories.map((subcat, sidx) => (
                        <button
                          key={sidx}
                          onClick={() => handleSubcategoryClick(category, subcat)}
                          className="text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 py-2 px-3 rounded transition-colors w-full text-left"
                        >
                          {subcat.sub_category_name}
                        </button>
                      ))
                    ) : (
                      <div className="col-span-2 text-sm text-gray-500 text-center py-4">
                        No subcategories available
                      </div>
                    )}
                  </div>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Categories - Horizontal Scroll - Show on screens smaller than XL */}
      <div className="xl:hidden mb-6">
        <div className="rounded-lg shadow-green p-3 md:p-4">
          <h3 className="font-heading font-bold text-base md:text-lg mb-3 md:mb-4 text-gray-800">Shop by Category</h3>
          <div className="flex space-x-3 md:space-x-4 overflow-x-auto scrollbar-hide pb-2">
            {mainCategories.map((category, idx) => (
              <div key={idx} className="flex-shrink-0">
                <div
                  className="flex flex-col items-center p-2 md:p-3 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors min-w-[70px] md:min-w-[90px]"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.icon && category.icon.startsWith('http') ? (
                    <img src={category.icon} alt={category.name} className="w-7 h-7 md:w-9 md:h-9 object-cover rounded mb-1.5 md:mb-2" />
                  ) : (
                    <span className="text-xl md:text-2xl mb-1.5 md:mb-2">{category.icon}</span>
                  )}
                  <span className="text-xs md:text-sm font-medium text-gray-700 text-center leading-tight">{category.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
