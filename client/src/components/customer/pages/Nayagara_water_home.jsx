import React, { useState, useEffect, memo, useCallback } from "react";
import { Droplets, Shield, Truck, Award, Users, Leaf, ChevronDown, Play, Star, ArrowRight, Target, Eye, Heart, Menu, X, Phone, Mail, Home, Info, MessageCircle, Settings, ShoppingBag } from "lucide-react";
import MobileMenu from "../layout/MobileMenu";

function NayagaraHome() {
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [flashSaleItems, setFlashSaleItems] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState('home');
  const [activeNavItem, setActiveNavItem] = useState('home');

  const scrollToContact = useCallback((productName = '', price = '', pricePrefix = '') => {
    const contactSection = document.getElementById('contact');

    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      setTimeout(() => {
        try {
          const subjectSelect = document.querySelector('select[name="subject"]');
          const messageTextarea = document.querySelector('textarea[name="message"]');

          if (subjectSelect) subjectSelect.value = 'Place an Order';
          if (messageTextarea) {
            const message = productName && price
              ? `I would like to order: ${productName}\nPrice: Rs ${price}${pricePrefix ? ' (' + pricePrefix.trim() + ')' : ''}\n\nPlease provide more details about this product and delivery options.`
              : 'I would like to place an order. Please provide more details about your products and delivery options.';
            messageTextarea.value = message;
          }
        } catch (error) {
          console.error('Form pre-fill failed:', error);
        }
      }, 800);
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  // Example: replace these fetch calls with your real API endpoints
  useEffect(() => {
    // Simulated fetch with example data
    const cats = [
      { id: 1, name: "Bottled Water", image: "/logo.png" },
      { id: 2, name: "Purifiers", image: "/logo.png" },
      { id: 3, name: "Mineral Water", image: "/logo.png" },
      { id: 4, name: "Accessories", image: "/logo.png" },
    ];

    const flash = [
      { id: 11, title: "5L Bottle", price: 450, oldPrice: 550, image: "/logo.png" },
      { id: 12, title: "10L Jar", price: 800, oldPrice: 1000, image: "/logo.png" },
      { id: 13, title: "Water Purifier", price: 12000, oldPrice: 15000, image: "/logo.png" },
    ];

    const newA = [
      { id: 21, title: "Spring Water 1L", price: 120, image: "/logo.png" },
      { id: 22, title: "Sparkling 0.5L", price: 90, image: "/logo.png" },
      { id: 23, title: "Filtered 5L", price: 420, image: "/logo.png" },
      { id: 24, title: "Eco Bottle", price: 350, image: "/logo.png" },
    ];

    // Put into state
    setFeaturedCategories(cats);
    setFlashSaleItems(flash);
    setNewArrivals(newA);
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 w-full overflow-x-hidden pb-safe">
      {/* Page Header with Navigation */}
      <SimpleHeader activeNavItem={activeNavItem} setActiveNavItem={setActiveNavItem} scrollToContact={scrollToContact} />

      {/* Hero Section */}
      <HeroSection scrollToContact={scrollToContact} />

      {/* Water Purification Process */}
      <PurificationProcess />

      {/* Product Showcase */}
      <div id="products-section" className="products-section">
        <ProductShowcase items={flashSaleItems} scrollToContact={scrollToContact} />
      </div>

      {/* Company Values */}
      <CompanyValues />

      {/* Vision & Mission Section */}
      <VisionMissionSection />

      {/* Founder Section */}
      <FounderSection />

      {/* Services Section */}
      <div id="services-section" className="services-section">
        <ServicesSection />
      </div>

      {/* Contact Section */}
      <ContactSection />

      {/* Newsletter */}
      <NewsletterSignup />

      {/* Customer Testimonials */}
      <CustomerTestimonials scrollToContact={scrollToContact} />

      {/* Add padding at bottom for mobile navigation */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
}

/* --------------------- Subcomponents below --------------------- */

// Responsive Header Component
const SimpleHeader = memo(function SimpleHeader({ activeNavItem, setActiveNavItem, scrollToContact }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'contact', label: 'Contact Us', icon: Phone },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'products', label: 'Products', icon: ShoppingBag }
  ];

  const handleNavClick = (sectionId) => {
    setActiveNavItem(sectionId);
    setIsMobileMenuOpen(false);

    setTimeout(() => {
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const sectionMap = {
        'about': 'vision-mission',
        'contact': 'contact',
        'services': 'services-section',
        'products': 'products-section'
      };

      const targetId = sectionMap[sectionId];
      if (!targetId) return;

      setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const headerOffset = 100;
          const targetPosition = targetElement.offsetTop - headerOffset;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }, 100);
    }, 150);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <Droplets className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Nayagara Water</h1>
              <p className="text-sm text-emerald-600">Pure Water Solutions</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 text-lg font-medium transition-all duration-200 ${activeNavItem === item.id
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-700 hover:text-emerald-600'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Contact Info */}
          <div className="flex items-center gap-4">

            <button onClick={() => scrollToContact()} className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              Order Now
            </button>
          </div>
        </div>

        {/* Tablet Header */}
        <div className="hidden md:flex lg:hidden items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Nayagara</h1>
              <p className="text-xs text-emerald-600">Pure Water</p>
            </div>
          </div>

          {/* Tablet Navigation */}
          <nav className="flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 text-sm font-medium transition-all duration-200 rounded ${activeNavItem === item.id
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Tablet Contact */}
          <button className="bg-emerald-600 text-white px-4 py-2 rounded text-sm">
            Order
          </button>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between py-3">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Nayagara</h1>
              <p className="text-xs text-emerald-600">Water</p>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Component */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
        activeNavItem={activeNavItem}
        handleNavClick={handleNavClick}
        scrollToContact={scrollToContact}
      />
    </header>
  );
});

// Hero Section - Super Attractive with Animations
const HeroSection = memo(function HeroSection({ scrollToContact }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] lg:h-screen flex items-center justify-center overflow-hidden py-16 sm:py-20 lg:py-0">
      {/* Background with Parallax Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1573160813959-9d7e71c75409?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>

      {/* Animated Water Droplets Background */}
      <div className="absolute inset-0 hidden sm:block">
        <div className="absolute top-20 left-10 animate-bounce delay-100">
          <Droplets className="w-8 h-8 text-emerald-300 opacity-60" />
        </div>
        <div className="absolute top-40 right-20 animate-bounce delay-300">
          <Droplets className="w-6 h-6 text-green-300 opacity-40" />
        </div>
        <div className="absolute bottom-40 left-1/4 animate-bounce delay-500">
          <Droplets className="w-10 h-10 text-emerald-400 opacity-50" />
        </div>
        <div className="absolute top-60 right-1/3 animate-bounce delay-700">
          <Droplets className="w-5 h-5 text-green-200 opacity-70" />
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-emerald-800/70 to-green-600/60"></div>

      {/* Animated Content */}
      <div className={`relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>

        {/* Floating Water Drop Animation */}
        <div className="mb-4 sm:mb-6 lg:mb-8 relative">
          <div className="animate-float">
            <Droplets className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-3 sm:mb-4 lg:mb-6 text-emerald-200 drop-shadow-lg" />
          </div>
        </div>

        {/* Main Heading with Typewriter Effect */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 text-white leading-tight">
          <span className="bg-gradient-to-r from-emerald-200 to-green-300 bg-clip-text text-transparent">
            Your Daily Dose Of
          </span>
          <br />
          <span className="text-white">Happiness</span>
        </h1>

        {/* Animated Subtitle */}
        <p className="text-base sm:text-lg md:text-xl lg:text-3xl mb-6 sm:mb-8 lg:mb-10 text-emerald-100 max-w-3xl mx-auto leading-relaxed px-2">
          Experience the difference with our
          <span className="text-emerald-200 font-semibold"> 6-stage purification </span>
          process delivering the purest water to your doorstep
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center items-center">
          <button onClick={() => scrollToContact()} className="group bg-emerald-500 hover:bg-emerald-600 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 rounded-full text-sm sm:text-base lg:text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-2 sm:gap-3">
            <span>Order Now</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button className="group bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white px-6 sm:px-8 py-3 sm:py-3.5 lg:py-4 rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:bg-white/30 transition-all duration-300 flex items-center gap-2 sm:gap-3">
            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Watch Our Story</span>
          </button>
        </div>

        {/* Scroll Down Indicator */}
        <div className="hidden lg:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-emerald-200" />
          <p className="text-emerald-200 text-sm mt-2">Scroll to Explore</p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
});

// Water Purification Process Section with Animations
const PurificationProcess = memo(function PurificationProcess() {
  const [visibleSteps, setVisibleSteps] = useState([]);

  const steps = [
    {
      icon: "🔍",
      title: "Pre-Filtration",
      desc: "Initial screening removes large particles and sediments",
      image: "/pre-filtering.jpg",
      delay: 100
    },
    {
      icon: "⚡",
      title: "Activated Carbon",
      desc: "Removes chlorine, odors and improves taste",
      image: "/carbon.jpg",
      delay: 200
    },
    {
      icon: "🧪",
      title: "Reverse Osmosis",
      desc: "99.9% contaminant removal through membrane filtration",
      image: "/waterjet.jpg",
      delay: 300
    },
    {
      icon: "💧",
      title: "UX Sterilization",
      desc: "Eliminates bacteria, viruses and microorganisms",
      image: "/Uv.jpg",
      delay: 400
    },
    {
      icon: "🍃",
      title: "Mineralization",
      desc: "Adds essential minerals for health and taste",
      image: "/Mineralization.jpg",
      delay: 500
    },
    {
      icon: "✅",
      title: "Quality Testing",
      desc: "Final purity verification and quality assurance",
      image: "/quality.jpg",
      delay: 600
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setVisibleSteps(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.process-step');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-green-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-20">

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Our <span className="text-emerald-600">6-Stage</span> Purification Process
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced multi-stage filtration technology ensures every drop meets the highest purity standards
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              data-index={index}
              className={`process-step group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform ${visibleSteps.includes(index)
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
                }`}
              style={{ transitionDelay: `${step.delay}ms` }}
            >
              {/* Image with Overlay */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 text-emerald-200 font-bold text-lg">
                  0{index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-emerald-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Flow Arrows for Desktop */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 pointer-events-none">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-8">
              <div className="flex justify-end items-center">
                <ArrowRight className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>
              <div className="flex justify-end items-center">
                <ArrowRight className="w-8 h-8 text-emerald-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

const FeaturedCategories = memo(function FeaturedCategories({ categories = [] }) {
  return (
    <section className="bg-white p-4 rounded-md shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Shop by Category</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="text-center p-3 border rounded hover:shadow-md cursor-pointer">
            <img src={c.image} alt={c.name} className="h-16 w-16 mx-auto object-contain" />
            <div className="mt-2 font-medium">{c.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
});

// Product Showcase Section with Enhanced Design
const ProductShowcase = memo(function ProductShowcase({ items = [], scrollToContact }) {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const enhancedProducts = [
    {
      id: 1,
      title: "Home Water Filters",
      subtitle: "Perfect for families",
      price: 65000,
      oldPrice: 68000,
      image: "/home_filter.jpg",
      features: ["Home Water Filters", "BPA Free", "6-Stage Purified", "Home Delivery"],
      description: "Our home water filters are designed to provide your family with clean and safe drinking water. Equipped with advanced filtration technology, these systems effectively remove contaminants and ensure optimal taste. Easy to install and maintain, they fit seamlessly into your home routine.",
      popular: true
    },
    {
      id: 2,
      title: "Institutional Water Filters",
      subtitle: "Ideal for workplace",
      price: 475000,
      pricePrefix: "Up to ",
      image: "/office_filter.jpg",
      features: ["Institutional Water Filters", "Food Grade", "Easy Handle", "Volume Discount"],
      description: "Our institutional water filters, designed for restaurants, schools, and hospitals, meet the high demand for clean water. These robust systems are designed for heavy use while maintaining high filtration standards. Trust our filters to protect the health of your establishment's patrons.",
      popular: false
    },
    {
      id: 3,
      title: "Bathroom Pollution Solutions",
      subtitle: "Complete filtration system",
      price: 330000,
      pricePrefix: "Up to ",
      image: "/bathroom_filter.jpg",
      features: ["Bathroom Pollution Solutions", "6-Stage Filter", "UV", "1 Year Warranty"],
      description: "Prevent bathroom pollution with our specialized filtration systems. These filters are designed to reduce harmful bacteria and impurities in water used in bathrooms. With a focus on hygiene, our solutions help create a safe environment in your home.",
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-emerald-100 px-4 py-2 rounded-full mb-6">
            <Star className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-800 font-semibold">Premium Quality</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Our <span className="text-emerald-600">Premium</span> Water Products
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our carefully crafted range of pure, healthy water solutions designed for every need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {enhancedProducts.map((product, index) => (
            <div
              key={product.id}
              className={`group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 ${product.popular ? 'ring-4 ring-emerald-400 ring-opacity-50' : ''
                }`}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Popular Badge */}
              {product.popular && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}

              {/* Product Image */}
              <div className="relative h-64 overflow-hidden bg-white flex items-center justify-center p-2">
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-lg shadow-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>

                {/* Floating Action */}
                <div className={`absolute bottom-4 right-4 transform transition-all duration-300 ${hoveredProduct === product.id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}>
                  <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{product.subtitle}</p>
                  {product.description && (
                    <p className="text-gray-600 text-sm mt-3 leading-relaxed">{product.description}</p>
                  )}
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full border border-emerald-200"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                {product.price && (
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-emerald-600">Rs {product.price}</span>
                        {product.pricePrefix && (
                          <div className="relative">
                            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                              {product.pricePrefix.trim()}
                            </span>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                          </div>
                        )}
                      </div>
                      {product.oldPrice && (
                        <span className="text-lg text-gray-400 line-through ml-2">Rs {product.oldPrice}</span>
                      )}
                    </div>
                    {product.oldPrice && (
                      <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-semibold">
                        Save Rs {product.oldPrice - product.price}
                      </div>
                    )}
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });

                      // Pre-fill form
                      setTimeout(() => {
                        const subjectSelect = document.querySelector('select[name="subject"]');
                        const messageTextarea = document.querySelector('textarea[name="message"]');

                        if (subjectSelect) {
                          subjectSelect.value = 'Place an Order';
                        }

                        if (messageTextarea) {
                          const priceText = product.price ? product.price.toLocaleString() : '';
                          const prefixText = product.pricePrefix || '';
                          messageTextarea.value = `I would like to order: ${product.title}\nPrice: Rs ${priceText}${prefixText ? ' (' + prefixText.trim() + ')' : ''}\n\nPlease provide more details about this product and delivery options.`;
                        }
                      }, 1000);
                    } else {
                      console.error('Contact section not found!');
                      alert('Contact section not found!');
                    }
                  }}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold hover:from-emerald-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Animated Border */}
              <div className="absolute inset-0 rounded-3xl border-2 border-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
});

// Company Values Section
const CompanyValues = memo(function CompanyValues() {
  const values = [
    { icon: Shield, title: "Quality Assurance", desc: "100% pure and safe water guaranteed" },
    { icon: Truck, title: "Fast Customer Service", desc: "Same-day services across the city" },
    { icon: Award, title: "Certified Standards", desc: "ISO certified purification process" },
    { icon: Users, title: "Customer First", desc: "Your satisfaction is our priority" },
    { icon: Leaf, title: "Eco-Friendly", desc: "Sustainable packaging and practices" },
    { icon: Droplets, title: "Pure Water", desc: "Advanced filtration technology" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Why Choose Nayagara Water?
          </h2>
          <p className="text-xl text-gray-600">
            Our commitment to excellence in every drop
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <IconComponent className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

const NewArrivals = memo(function NewArrivals({ items = [] }) {
  return (
    <section className="bg-white p-4 rounded-md shadow-sm">
      <h3 className="text-xl font-semibold mb-4">New Arrivals</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map((it) => (
          <ProductCard key={it.id} product={it} />
        ))}
      </div>
    </section>
  );
});

const ProductCard = memo(function ProductCard({ product }) {
  return (
    <div className="bg-white border rounded p-3 flex flex-col">
      <img src={product.image} alt={product.title} className="h-28 w-full object-contain mb-2" />
      <div className="flex-1">
        <div className="font-medium text-sm">{product.title}</div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="font-semibold">Rs {product.price}</div>
        <button className="px-2 py-1 bg-blue-600 text-white rounded text-sm">Buy</button>
      </div>
    </div>
  );
});

// Vision & Mission Section
const VisionMissionSection = memo(function VisionMissionSection() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.05 }
    );

    const section = document.getElementById('vision-mission');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="vision-mission" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-teal-400/5 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Water Droplets Pattern */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Droplets className="w-4 h-4 text-emerald-300" />
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 sm:mb-16 lg:mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-emerald-500/20 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8 border border-emerald-400/30">
            <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-300" />
            <span className="text-emerald-100 font-semibold text-sm sm:text-lg">Our Purpose</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
            <span className="bg-gradient-to-r from-emerald-200 to-green-300 bg-clip-text text-transparent">
              Vision & Mission
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-emerald-100 max-w-4xl mx-auto leading-relaxed px-4">
            Driven by purpose, guided by values, and committed to delivering pure water solutions
            that transform lives and communities across Sri Lanka
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Vision Card */}
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}>
            <div className="group bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-500 hover:transform hover:scale-105 relative overflow-hidden">
              {/* Card Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Icon */}
              <div className="relative z-10 mb-6 sm:mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-500">
                  <Eye className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 group-hover:text-emerald-200 transition-colors">
                  Our Vision
                </h3>
                <p className="text-emerald-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                  "To become the number one best online goods and services provider in Sri Lanka by 2030 by increasing customer satisfaction."
                  <br /><br />
                  "පාරිභෝගික තෘප්තිය වැඩි කිරීමෙන් 2030 වන විට ශ්‍රී ලංකාවේ අංක එකේ වඩාත් හොඳම අන්තර්ජාල භාණ්ඩ සහ සේවා සැපයුම්කරු බවට පත්වීම."
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-2 border-emerald-300 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Mission Card */}
          <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}>
            <div className="group bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-green-400/20 hover:border-green-400/40 transition-all duration-500 hover:transform hover:scale-105 relative overflow-hidden">
              {/* Card Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Icon */}
              <div className="relative z-10 mb-6 sm:mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-500">
                  <Target className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 group-hover:text-green-200 transition-colors">
                  Our Mission
                </h3>
                <p className="text-green-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                  "Our mission is to empower every Sri Lankan to shop with confidence by building the country's most trusted and customer-centric e-commerce platform. To become the online goods and services provider of choice."
                  <br /><br />
                  "අපගේ මෙහෙවර වන්නේ රටේ වඩාත්ම විශ්වාසදායක සහ පාරිභෝගික කේන්ද්‍රීය විද්‍යුත් වාණිජ්‍ය වේදිකාව ගොඩනැගීම මගින් සෑම ශ්‍රී ලාංකිකයෙකුටම විශ්වාසයෙන් යුතුව සාප්පු සවාරි යාමට බලගැන්වීම අපගේ මෙහෙවරයි. ඔබ කැමතිම මාර්ගගත භාණ්ඩ හා සේවා සපයන්නා බවට පත්වීම."
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-2 border-green-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className={`mt-12 sm:mt-16 lg:mt-20 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          <div className="text-center mb-8 sm:mb-10 lg:mb-12 px-4">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">Core Values</h3>
            <p className="text-emerald-100 text-sm sm:text-base lg:text-lg">The principles that guide every decision we make</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4">
            {[
              {
                icon: Shield,
                title: "Quality Excellence",
                desc: "Uncompromising standards in every drop of water we deliver",
                color: "emerald"
              },
              {
                icon: Heart,
                title: "Customer Care",
                desc: "Your health and satisfaction are at the heart of everything we do",
                color: "green"
              },
              {
                icon: Leaf,
                title: "Sustainability",
                desc: "Protecting our environment for future generations",
                color: "teal"
              }
            ].map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center group">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-${value.color}-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-${value.color}-500/30 transition-colors`}>
                    <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-${value.color}-300`} />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{value.title}</h4>
                  <p className="text-emerald-100 text-sm sm:text-base">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-12 sm:mt-16 lg:mt-20 transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-emerald-400/20 max-w-2xl mx-4 sm:mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              Ready to Experience Pure Water?
            </h3>
            <p className="text-emerald-100 mb-4 sm:mb-6 text-sm sm:text-base">
              Join our mission to provide pure, healthy water to every home in Sri Lanka
            </p>
            <button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base">
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

// Founder Section
const FounderSection = memo(function FounderSection() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.05 }
    );

    const section = document.getElementById('founder');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="founder" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-emerald-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-10 sm:mb-12 lg:mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 px-2">
            Meet Our <span className="text-emerald-600">Founder</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            The visionary leader behind Nayagara Water's commitment to pure, sustainable water solutions
          </p>
        </div>

        {/* Founder Card */}
        <div className={`max-w-4xl mx-auto transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 p-4 sm:p-6 lg:p-8">
            {/* Cute Founder Profile */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="relative inline-block">
                {/* Profile Image - Responsive */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 mx-auto mb-4 sm:mb-6">
                  <img
                    src="/owner.jpg"
                    alt="Founder - Mr.Gayan Thennakoon"
                    className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full object-cover border-3 sm:border-4 border-emerald-200 shadow-lg hover:scale-110 transition-transform duration-500"
                  />

                  {/* Cute Decorative Elements */}
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>

                  <div className="absolute -bottom-1 -left-1 sm:-left-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-xs sm:text-sm">⭐</span>
                  </div>

                  <div className="absolute top-2 sm:top-3 -left-3 sm:-left-4 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-80 animate-pulse"></div>
                </div>

                {/* Cute Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-green-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-emerald-200">
                  <span className="text-base sm:text-lg">👨‍💼</span>
                  <span className="text-emerald-700 font-semibold text-xs sm:text-sm">Founder & CEO</span>
                </div>
              </div>

              {/* Name & Title */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  Mr. Gayan Thennakoon
                </h3>
                <p className="text-emerald-600 text-base sm:text-lg font-semibold">
                  Founder & CEO, Nayagara Lanka (Pvt) Ltd
                </p>
                <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full mx-auto mt-2 sm:mt-3"></div>
              </div>
            </div>

            {/* Content in a cleaner layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Story Section */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-100">
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">📖</span>
                    A Message from Our CEO
                  </h4>
                  <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
                    <p>
                      At Nayagara Lanka, our journey began with a simple belief — that every home and every
                      business deserves access to reliable solutions that make life better. From water purification to
                      modern e-commerce, our mission has always been about more than products. It's about <b>trust,
                        progress, and people.</b>
                    </p>
                    <p>
                      We grew from Niagara Water in 2018 into Nayagara Lanka in 2023 because we never
                      stopped learning, never stopped improving, and never stopped listening to our customers.
                      Today, as we step into the world of online shopping, our promise remains the same:,<b> to serve
                        every Sri Lankan with quality, honesty, and care.</b>
                    </p>
                    <p>
                      The future belongs to those who innovate with purpose — and together, we're creating a
                      future that is cleaner, safer, and more connected. With every product delivered, with every
                      customer supported, we are not just building a business… we are building trust and shaping
                      tomorrow.
                    </p>
                  </div>
                </div>



              </div>

              {/* Stats & Achievements */}
              <div className="space-y-4 sm:space-y-6">
                {/* Cute Stats Cards */}
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4">
                  <div className="bg-emerald-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-center border-2 border-emerald-100 hover:border-emerald-300 transition-colors">
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🏆</div>
                    <div className="text-xl sm:text-2xl font-bold text-emerald-600">8+</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Years Experience</div>
                  </div>

                  <div className="bg-green-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-center border-2 border-green-100 hover:border-green-300 transition-colors">
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">👥</div>
                    <div className="text-xl sm:text-2xl font-bold text-green-600">500+</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Families Served</div>
                  </div>

                  <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-center border-2 border-blue-100 hover:border-blue-300 transition-colors">
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🌟</div>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">ISO</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Certified Quality</div>
                  </div>
                </div>

                {/* Contact Card
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <h5 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-lg">📞</span>
                    Connect with our team
                  </h5>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>founder@nayagara.lk</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>+94 12 345 6789</span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Company Journey Timeline */}
        <div className={`mt-12 sm:mt-16 lg:mt-20 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
          <div className="text-center mb-8 sm:mb-10 lg:mb-12 px-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Our Journey</h3>
            <p className="text-gray-600 text-sm sm:text-base">Key milestones in our mission to provide pure water</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { year: "2018", event: "Company Founded", desc: "Started with a vision for pure water" },
              { year: "2020", event: "First 100 Customers", desc: "Reached our first major milestone" },
              { year: "2022", event: "ISO Certification", desc: "Achieved international quality standards" },
              { year: "2024", event: "500+ Families", desc: "Serving communities across Sri Lanka" }
            ].map((milestone, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white font-bold text-base sm:text-lg">
                  {index + 1}
                </div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-600 mb-1 sm:mb-2">{milestone.year}</div>
                <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">{milestone.event}</h4>
                <p className="text-gray-600 text-xs sm:text-sm">{milestone.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

// Services Section
const ServicesSection = memo(function ServicesSection() {
  const services = [
    {
      title: "Home Delivery",
      description: "Fresh water delivered to your doorstep daily",
      icon: "🚚",
      features: ["Same-day delivery", "Flexible timing", "No delivery charges"]
    },
    {
      title: "Office Supply",
      description: "Bulk water supply for offices and businesses",
      icon: "🏢",
      features: ["Volume discounts", "Regular schedule", "Invoice billing"]
    },
    {
      title: "Event Catering",
      description: "Water supply for events and gatherings",
      icon: "🎉",
      features: ["Event planning", "Setup service", "Emergency supply"]
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            Our Services
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-4">
            Comprehensive water solutions for every need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-shadow">
              <div className="text-center mb-4 sm:mb-6">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{service.icon}</div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{service.description}</p>
              </div>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700 text-sm sm:text-base">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full mt-4 sm:mt-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

// Contact Section
const ContactSection = memo(function ContactSection() {
  return (
    <section id="contact" className="py-10 sm:py-12 lg:py-16 bg-gradient-to-br from-emerald-50 to-green-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-500 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-green-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 px-3 py-1 rounded-full mb-3 sm:mb-4">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-800 font-semibold text-xs sm:text-sm">Get in Touch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
            Contact <span className="text-emerald-600">Us</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Ready to experience pure water? Get in touch with our team
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Google Map Location */}
          <div className="space-y-4">
            {/* Google Maps Embed */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  Our Location
                </h3>
                <p className="text-sm text-gray-600 mt-1">Nayagara Lanka pvt, Anamaduwa</p>
              </div>

              {/* Google Maps iFrame */}
              <div className="relative h-64 sm:h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.1234567890123!2d80.0148205!3d7.890179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afd27cdf42130f5%3A0x1fc14e993f614e69!2sNayagara%20Lanka%20pvt%20ltd!5e0!3m2!1sen!2slk!4v1640000000000!5m2!1sen!2slk"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Nayagara Lanka Location"
                  className="absolute inset-0"
                ></iframe>
              </div>
            </div>

            {/* Contact Information Cards */}
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">Phone Numbers</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Main: <a href="tel:+94123456789" className="text-emerald-600">+94 37 316 6584</a></p>
                      <p>Orders: <a href="tel:+94123456790" className="text-emerald-600">+94 76 125 0050</a></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">Email Addresses</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>General: <a href="mailto:info@nayagara.lk" className="text-emerald-600">info@nayagara.lk</a></p>
                      <p>Orders: <a href="mailto:orders@nayagara.lk" className="text-emerald-600">orders@nayagara.lk</a></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">🕒</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">Business Hours</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Mon-Fri: <span className="font-medium">8:00 AM - 6:00 PM</span></p>
                      <p>Saturday: <span className="font-medium">9:00 AM - 4:00 PM</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <a href="tel:+94776613003" className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-3 rounded-xl text-center block hover:from-emerald-600 hover:to-green-700 transition-colors">
                <div className="text-xl mb-1">📞</div>
                <div className="font-bold text-sm">Call Now</div>
              </a>

              <a href="https://wa.me/94761250050" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-xl text-center block hover:from-green-600 hover:to-emerald-700 transition-colors">
                <div className="text-xl mb-1">
                  <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516" />
                  </svg>
                </div>
                <div className="font-bold text-sm">WhatsApp</div>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">✉️</span>
              Send us a Message
            </h3>

            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                subject: formData.get('subject'),
                message: formData.get('message')
              };

              // Validate required fields
              if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.subject || !data.message) {
                alert('Please fill in all required fields.');
                return;
              }

              // Create professional email content
              const emailSubject = `Website Contact: ${data.subject}`;
              const emailBody = `New message from Nayagara Water website:

Full Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Subject: ${data.subject}

Message:
${data.message}

---
This message was sent from the Nayagara Water website contact form.
Please respond to the customer's email: ${data.email}`;

              // Create mailto link
              const mailtoLink = `mailto:info@nayagara.lk?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

              try {
                // Open email client
                window.location.href = mailtoLink;

                // Show improved success message
                setTimeout(() => {
                  const response = confirm(
                    `✅ Email ready to send to info@nayagara.lk\n\n` +
                    `Your email client should now be open with your message.\n` +
                    `If it didn't open, please manually email: info@nayagara.lk\n\n` +
                    `Click OK to clear this form, or Cancel to keep your information.`
                  );

                  if (response) {
                    // Clear the form
                    e.target.reset();
                    alert('Form cleared. Thank you for contacting Nayagara Water!');
                  }
                }, 1000);

              } catch (error) {
                alert('⚠️ Could not open email client.\n\nPlease manually send your message to:\ninfo@nayagara.lk');
              }
            }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  placeholder="+94 77 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <select name="subject" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors">
                  <option>General Inquiry</option>
                  <option>Place an Order</option>
                  <option>Technical Support</option>
                  <option>Partnership Opportunity</option>
                  <option>Complaint</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  rows="4"
                  name="message"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-lg font-bold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <span>Send Message</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">We Service Across Sri Lanka</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['Colombo', 'Kaluthara', 'Gampaha','Negambo', 'Kegalle', 'Kurunegala', 'Puttalam', 'Mannar', 'Anuradhapura'].map((city, index) => (
              <div key={index} className="bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow border border-emerald-100">
                <span className="text-gray-700 font-medium">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

const NewsletterSignup = memo(function NewsletterSignup() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="mb-8">
          <Droplets className="w-12 h-12 mx-auto mb-4 text-emerald-200" />
          <h2 className="text-4xl font-bold mb-4">Stay Hydrated with Our Updates</h2>
          <p className="text-xl text-emerald-100">
            Get the latest offers, health tips, and water delivery updates straight to your inbox
          </p>
        </div>
        <div className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="Enter your email address"
              type="email"
            />
            <button className="px-8 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-emerald-100 text-sm mt-4">
            No spam, just pure water updates and exclusive offers
          </p>
        </div>
      </div>
    </section>
  );
});

// Customer Testimonials Section with animations
const CustomerTestimonials = memo(function CustomerTestimonials({ scrollToContact }) {
  const [visibleItems, setVisibleItems] = useState(new Set());

  const testimonials = [
    {
      id: 1,
      name: "Sachini Perera",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 5,
      text: "The best water delivery service in Colombo! Always on time and the water quality is exceptional. My family loves the taste.",
      location: "Colombo 07",
      verified: true
    },
    {
      id: 2,
      name: "Kasun Silva",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 5,
      text: "Switched to Nayagara Water 6 months ago and never looked back. Crystal clear water with perfect pH balance. Highly recommended!",
      location: "Kandy",
      verified: true
    },
    {
      id: 3,
      name: "Nimali Fernando",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 5,
      text: "Amazing customer service and premium water quality. The home delivery is so convenient and the bottles are always clean.",
      location: "Galle",
      verified: true
    },
    {
      id: 4,
      name: "Rohan Jayawardena",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 5,
      text: "Our office has been using Nayagara Water for 2 years. Reliable service, competitive pricing, and excellent water quality.",
      location: "Negombo",
      verified: true
    },
    {
      id: 5,
      name: "Anusha Wijesinghe",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 5,
      text: "Love the eco-friendly packaging and the taste is pure and refreshing. Great for my children's health and development.",
      location: "Matara",
      verified: true
    },
    {
      id: 6,
      name: "Chaminda Rathnayake",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      rating: 5,
      text: "Fast delivery, excellent water quality, and friendly staff. Been a loyal customer for 3 years and will continue to be!",
      location: "Jaffna",
      verified: true
    }
  ];

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '50px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index);
          setVisibleItems(prev => new Set([...prev, index]));
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.testimonial-card');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 to-green-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-300 rounded-full opacity-10 animate-ping"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-6">
            <span className="text-2xl">💬</span>
            <span className="text-green-700 font-semibold">Customer Stories</span>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who trust Nayagara Water for their daily hydration needs.
            Real reviews from real people across Sri Lanka.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(5)}</div>
              <span className="text-lg font-semibold text-gray-700">4.9/5</span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <span className="text-gray-600">Over 10,000+ Happy Customers</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              data-index={index}
              className={`testimonial-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform transition-all duration-700 ${visibleItems.has(index)
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
                } hover:-translate-y-2 relative overflow-hidden group`}
              style={{
                transitionDelay: `${index * 150}ms`
              }}
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex">{renderStars(testimonial.rating)}</div>
                  {testimonial.verified && (
                    <div className="flex items-center gap-1 text-green-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-700 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </blockquote>

                {/* Customer Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-green-200 group-hover:border-green-400 transition-colors"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Join Our Happy Customers?
            </h3>
            <p className="text-gray-600 mb-6">
              Experience the pure difference with Nayagara Water. Order now and taste the quality yourself!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => scrollToContact()} className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Order Now
              </button>
              <button className="px-8 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute top-20 right-20 animate-float">
        <div className="w-6 h-6 bg-blue-300 rounded-full opacity-60"></div>
      </div>
      <div className="absolute bottom-32 left-16 animate-float-delayed">
        <div className="w-4 h-4 bg-green-300 rounded-full opacity-60"></div>
      </div>
      <div className="absolute top-1/3 right-1/4 animate-float-slow">
        <div className="w-8 h-8 bg-emerald-200 rounded-full opacity-40"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite 1s;
        }
        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite 2s;
        }
      `}</style>
    </section>
  );
});

export default memo(NayagaraHome);
