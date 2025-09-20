import React from 'react';
import { ChevronRight } from 'lucide-react';

const Sidebar = ({ mainCategories }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64">
        <div className="bg-white rounded-lg shadow-green p-4 sticky top-24">
          <h3 className="font-heading font-bold text-lg mb-4 text-gray-800">Shop by Category</h3>
          <div className="space-y-2">
            {mainCategories.map((category, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium text-gray-700 group-hover:text-primary-600">{category.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                </div>
                
                {/* Submenu */}
                <div className="hidden group-hover:block absolute left-full top-0 w-64 bg-white border border-gray-200 rounded-lg shadow-green-lg ml-2 p-4 z-50">
                  <h4 className="font-bold text-gray-800 mb-3">{category.name}</h4>
                  <div className="grid gap-1">
                    {category.subcats.map((subcat, sidx) => (
                      <a key={sidx} href="#" className="text-sm text-gray-600 hover:text-primary-600 py-1 transition-colors">
                        {subcat}
                      </a>
                    ))}
                  </div>
                  <img src={category.image} alt={category.name} className="w-full h-32 object-cover rounded-lg mt-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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