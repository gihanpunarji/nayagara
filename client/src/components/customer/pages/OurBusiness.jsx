import React from 'react';
import { Building, Users, TrendingUp, MapPin, CheckCircle, DollarSign, Clock, Award } from 'lucide-react';

const OurBusiness = () => {
  const businessMetrics = [
    { icon: Users, label: 'Active Sellers', value: '50,000+', color: 'bg-blue-500' },
    { icon: TrendingUp, label: 'Monthly Transactions', value: '100K+', color: 'bg-green-500' },
    { icon: DollarSign, label: 'Total GMV', value: 'Rs. 2B+', color: 'bg-purple-500' },
    { icon: MapPin, label: 'Delivery Locations', value: '350+', color: 'bg-orange-500' }
  ];

  const businessSolutions = [
    {
      icon: Building,
      title: 'Enterprise Solutions',
      description: 'Comprehensive e-commerce solutions for large businesses and enterprises.',
      features: ['Custom storefronts', 'Bulk listing tools', 'Advanced analytics', 'Priority support']
    },
    {
      icon: Users,
      title: 'SME Partnership',
      description: 'Tailored programs to help small and medium enterprises grow online.',
      features: ['Easy onboarding', 'Marketing support', 'Training programs', 'Flexible fees']
    },
    {
      icon: Clock,
      title: 'Logistics Network',
      description: 'Island-wide delivery network ensuring fast and reliable shipping.',
      features: ['Same-day delivery', '24/7 tracking', 'Cash on delivery', 'Return management']
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Rigorous quality control and seller verification processes.',
      features: ['Seller verification', 'Product quality checks', 'Customer reviews', 'Dispute resolution']
    }
  ];

  const industries = [
    { name: 'Electronics & Technology', percentage: 25, color: 'bg-blue-500' },
    { name: 'Fashion & Apparel', percentage: 20, color: 'bg-pink-500' },
    { name: 'Home & Living', percentage: 18, color: 'bg-green-500' },
    { name: 'Automotive', percentage: 15, color: 'bg-red-500' },
    { name: 'Services', percentage: 12, color: 'bg-yellow-500' },
    { name: 'Others', percentage: 10, color: 'bg-gray-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="px-6 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Our Business</h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Powering Sri Lanka's digital economy through innovative marketplace solutions
            </p>
          </div>
        </div>
      </div>

      {/* Business Metrics */}
      <div className="px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Business Impact</h2>
        <div className="grid grid-cols-2 gap-4 mb-12">
          {businessMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className={`w-12 h-12 ${metric.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </div>
            );
          })}
        </div>

        {/* Business Solutions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Business Solutions</h2>
          <div className="space-y-6">
            {businessSolutions.map((solution, index) => {
              const IconComponent = solution.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{solution.description}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {solution.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Industry Breakdown */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Industry Distribution</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="space-y-4">
              {industries.map((industry, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{industry.name}</span>
                    <span className="text-sm font-bold text-gray-900">{industry.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${industry.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${industry.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partnership Opportunities */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100">
          <div className="text-center">
            <Building className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Partner With Us</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Join thousands of successful businesses that have grown their revenue through our platform.
              We offer comprehensive support, advanced tools, and marketing opportunities to help you succeed.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <a
                href="/seller/register"
                className="bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Start Selling Today
              </a>
              <a
                href="/contact"
                className="bg-white text-primary-600 py-3 px-6 rounded-lg font-medium border border-primary-600 hover:bg-primary-50 transition-colors"
              >
                Contact Our Business Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurBusiness;