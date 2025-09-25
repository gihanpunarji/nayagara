import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const Sidebar = ({ mainCategories }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64">
        <div className="bg-white rounded-lg shadow-green p-4 sticky top-24">
          <h3 className="font-heading font-bold text-lg mb-4 text-gray-800">Shop by Category</h3>
          <div className="space-y-2">
            {mainCategories.map((category, idx) => (
              <div
                key={idx}
                className="relative"
                onMouseEnter={() => setHoveredCategory(idx)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium text-gray-700 hover:text-primary-600">{category.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 hover:text-primary-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Dropdown - Fixed Positioning */}
      {hoveredCategory !== null && (
        <div
          className="fixed w-80 bg-white border border-gray-200 rounded-lg shadow-2xl p-6"
          style={{
            top: '200px',
            left: '280px',
            zIndex: 9999999
          }}
          onMouseEnter={() => setHoveredCategory(hoveredCategory)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <h4 className="font-bold text-gray-800 mb-4 text-lg">{mainCategories[hoveredCategory].name}</h4>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {mainCategories[hoveredCategory].subcats.map((subcat, sidx) => (
              <a
                key={sidx}
                href={`/shop?category=${encodeURIComponent(mainCategories[hoveredCategory].name.toLowerCase())}&subcat=${encodeURIComponent(subcat.toLowerCase())}`}
                className="text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 py-2 px-3 rounded transition-colors"
              >
                {subcat}
              </a>
            ))}
          </div>
          <img
            src={mainCategories[hoveredCategory].image}
            alt={mainCategories[hoveredCategory].name}
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Mobile Categories - Horizontal Scroll */}
      <div className="lg:hidden mb-6">
        <div className="bg-white rounded-lg shadow-green p-4">
          <h3 className="font-heading font-bold text-lg mb-4 text-gray-800">Shop by Category</h3>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
            {mainCategories.map((category, idx) => (
              <div key={idx} className="flex-shrink-0">
                <div className="flex flex-col items-center p-3 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors min-w-[80px]">
                  <span className="text-2xl mb-2">{category.icon}</span>
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight">{category.name}</span>
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