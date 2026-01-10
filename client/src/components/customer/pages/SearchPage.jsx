import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Grid,
  List,
  MapPin,
} from 'lucide-react';

import { publicApi } from '../../../api/axios';
import AdvancedFilters from '../layout/AdvancedFilters';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, limit: 12 });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  // Applied filters from AdvancedFilters
  const [appliedFilters, setAppliedFilters] = useState({
    priceMin: '',
    priceMax: ''
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);

      // Add all applied filters from AdvancedFilters
      Object.keys(appliedFilters).forEach(key => {
        if (appliedFilters[key] && appliedFilters[key] !== '' && appliedFilters[key] !== 'All' && appliedFilters[key] !== 'Any') {
          params.append(key, appliedFilters[key]);
        }
      });

      // Add sort parameter
      switch (sortBy) {
        case 'price_low':
          params.append('sort', 'price_low');
          break;
        case 'price_high':
          params.append('sort', 'price_high');
          break;
        case 'newest':
        case 'relevance':
        default:
          params.append('sort', 'newest');
          break;
      }

      const response = await publicApi.get(`/products/public?${params.toString()}`);

      if (response.data.success) {
        setProducts(response.data.data);
        setTotal(response.data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Update search query state if URL param changes
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await publicApi.get('/categories-with-subcategories');
        const categoriesData = res.data.data || [];
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, appliedFilters, sortBy, pagination.page]);

  // Update URL when search query is submitted
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchQuery });
  };

  const handleApplyFilters = (filters) => {
    console.log('Filters applied:', filters);

    // Store price filters
    const newFilters = {
      priceMin: filters.priceMin || '',
      priceMax: filters.priceMax || ''
    };

    console.log('New filters:', newFilters);
    setAppliedFilters(newFilters);

    // If category changed in filter, update it
    if (filters.category && filters.category !== 'All Categories') {
      const categorySlug = filters.category.toLowerCase().replace(/\s+/g, '-');
      console.log('Category changed to:', categorySlug);
      setSelectedCategory(categorySlug);
    }

    // Reset pagination when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const calculateDiscount = (price, marketPrice) => {
    if (!marketPrice || marketPrice <= price) return 0;
    return Math.round(((marketPrice - price) / marketPrice) * 100);
  };

  const ProductCard = ({ product }) => {
    const discount = calculateDiscount(product.price, product.market_price);
    const image = product.images && product.images.length > 0 ? product.images[0].image_url : null;
    
    return (
      <Link to={`/product/${product.product_id}`} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full hover:border-primary-200">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-white p-2">
          {image ? (
            <img 
              src={image} 
              alt={product.product_title} 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
               <Search className="w-8 h-8 text-gray-300" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded shadow-sm">
                -{discount}%
              </span>
            )}
            {product.is_featured === 1 && (
              <span className="bg-yellow-400 text-yellow-900 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded shadow-sm">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col bg-white">
          <div className="text-[10px] sm:text-xs text-gray-500 mb-1 truncate">{product.category_name}</div>
          <h3 className="font-medium text-xs sm:text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight h-8 sm:h-10">
            {product.product_title}
          </h3>
          
          <div className="mt-auto">
             <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-sm sm:text-lg font-bold text-primary-600">
                  LKR {parseFloat(product.price).toLocaleString()}
                </span>
                {discount > 0 && (
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                    LKR {parseFloat(product.market_price).toLocaleString()}
                  </span>
                )}
             </div>
             
             <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
               {product.location_city_name && (
                 <div className="flex items-center text-[10px] sm:text-xs text-gray-500 max-w-[70%]">
                   <MapPin className="w-3 h-3 mr-0.5 flex-shrink-0" />
                   <span className="truncate">{product.location_city_name}</span>
                 </div>
               )}
               
               {/* Mobile only simplified view could go here, but keeping it consistent for now */}
             </div>
          </div>
        </div>
      </Link>
    );
  };

  const ProductListItem = ({ product }) => {
     const discount = calculateDiscount(product.price, product.market_price);
     const image = product.images && product.images.length > 0 ? product.images[0].image_url : null;

     return (
       <Link to={`/product/${product.product_id}`} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex p-4">
         {/* Image */}
         <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
            <img 
               src={image || '/placeholder.png'} 
               alt={product.product_title} 
               className="w-full h-full object-contain" 
            />
             {discount > 0 && (
              <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                -{discount}%
              </span>
            )}
         </div>
         
         {/* Content */}
         <div className="ml-4 flex-1 flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-gray-500 mb-1">{product.category_name}</div>
                <h3 className="font-medium text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {product.product_title}
                </h3>
              </div>
              <div className="text-right">
                 <div className="text-lg font-bold text-gray-900">
                    LKR {parseFloat(product.price).toLocaleString()}
                 </div>
                  {discount > 0 && (
                  <div className="text-xs text-gray-500 line-through">
                    LKR {parseFloat(product.market_price).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2 mt-2">{product.product_description}</p>
            
            <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center space-x-4">
                     {product.seller_name && (
                        <div className="text-xs text-gray-500">
                          Sold by: {product.seller_name}
                        </div>
                     )}
                     {product.location_city_name && (
                       <div className="flex items-center text-xs text-gray-500">
                         <MapPin className="w-3 h-3 mr-1" />
                         <span>{product.location_city_name}</span>
                       </div>
                     )}
                </div>
                <button className="text-primary-600 font-medium text-sm hover:underline">
                    View Details
                </button>
            </div>
         </div>
       </Link>
     );
  };

  // Format categories for AdvancedFilters
  const mainCategories = categories.map(cat => ({
    name: cat.category_name,
    slug: cat.category_slug || cat.category_name.toLowerCase().replace(/\s+/g, '-')
  }));

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Advanced Filters Modal */}
      <AdvancedFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onFiltersApply={handleApplyFilters}
        selectedCategory={selectedCategory === 'all' ? 'All Categories' : capitalizeFirstLetter(selectedCategory)}
        mainCategories={mainCategories}
      />

      {/* Search Header (Mobile) */}
      <div className="bg-white sticky top-0 z-30 px-4 py-3 shadow-sm md:hidden">
       
        
        {/* Filter Bar */}
        <div className="flex items-center justify-between mt-3 overflow-x-auto">
           <button 
             onClick={() => setShowFilters(true)}
             className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium whitespace-nowrap mr-2"
           >
             <Filter className="w-4 h-4" />
             <span>Filters</span>
           </button>
           
           <div className="flex items-center space-x-2">
             <select 
               value={sortBy} 
               onChange={(e) => setSortBy(e.target.value)}
               className="bg-transparent text-sm font-medium border-none focus:ring-0 p-0 pr-6"
             >
                <option value="relevance">Relevance</option>
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
             </select>
             
             <div className="flex bg-gray-100 rounded-lg p-1">
               <button 
                 onClick={() => setViewMode('grid')}
                 className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
               >
                 <Grid className="w-4 h-4" />
               </button>
               <button 
                 onClick={() => setViewMode('list')}
                 className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
               >
                 <List className="w-4 h-4" />
               </button>
             </div>
           </div>
        </div>
      </div>
      
      {/* Filter Sidebar (Desktop mostly, but for mobile we have modal or hidden) */}
      {/* Simplification: Just rendering results for now as per mobile focus */}

      <div className="max-w-7xl mx-auto px-4 py-6">
         {/* Results Info */}
         <div className="mb-4">
             <h1 className="text-lg font-semibold text-gray-900">
               {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
             </h1>
             <p className="text-sm text-gray-500">{total} items found</p>
         </div>
         
         {loading ? (
             <div className="flex justify-center py-12">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
             </div>
         ) : products.length === 0 ? (
             <div className="text-center py-12">
                 <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                 <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                 <p className="text-gray-500">Try checking your spelling or use different keywords.</p>
             </div>
         ) : (
             <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}>
                 {products.map(product => (
                    viewMode === 'grid' ? (
                       <ProductCard key={product.product_id} product={product} />
                    ) : (
                       <ProductListItem key={product.product_id} product={product} />
                    )
                 ))}
             </div>
         )}
         
         {/* Pagination */}
         {total > pagination.limit && (
           <div className="mt-8 flex justify-center">
             <div className="flex space-x-2">
               <button 
                  onClick={() => setPagination(p => ({...p, page: p.page - 1}))}
                  disabled={pagination.page <= 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
               >
                 Previous
               </button>
               <button 
                  onClick={() => setPagination(p => ({...p, page: p.page + 1}))}
                  disabled={products.length < pagination.limit} 
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
               >
                 Next
               </button>
             </div>
           </div>
         )}
      </div>
      
    </div>
  );
};

export default SearchPage;