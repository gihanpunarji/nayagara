import React from 'react';
import { Users, Target, Award, Globe, Heart, TrendingUp, Shield, Truck } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { icon: Users, label: 'Active Users', value: '500K+', color: 'bg-blue-500' },
    { icon: Globe, label: 'Cities Covered', value: '25+', color: 'bg-green-500' },
    { icon: Award, label: 'Years of Trust', value: '5+', color: 'bg-purple-500' },
    { icon: TrendingUp, label: 'Products Listed', value: '1M+', color: 'bg-orange-500' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We put our customers at the center of everything we do, ensuring the best shopping experience.'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Your security is our priority. We maintain the highest standards of safety and trust.'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'We continuously innovate to bring you the latest technology and best user experience.'
    },
    {
      icon: Truck,
      title: 'Reliable Service',
      description: 'Fast, reliable delivery and excellent customer service across Sri Lanka.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-600 text-white">
        <div className="px-6 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">About Nayagara</h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Sri Lanka's most trusted online marketplace connecting buyers and sellers nationwide
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-12">
        <div className="grid grid-cols-2 gap-4 mb-12">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Founded in 2019, Nayagara began with a simple mission: to create Sri Lanka's most trusted
              and user-friendly online marketplace. We recognized the need for a platform that could
              connect buyers and sellers across the island with complete transparency and security.
            </p>
            <p>
              Starting with just a handful of sellers in Colombo, we've grown to serve over 500,000
              active users across 25+ cities in Sri Lanka. Our platform hosts more than 1 million
              product listings spanning everything from electronics and vehicles to fashion and services.
            </p>
            <p>
              What sets us apart is our commitment to building trust. Every seller goes through a
              verification process, and we offer comprehensive buyer protection to ensure safe
              transactions for everyone.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Values</h2>
          <div className="space-y-4">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To democratize commerce in Sri Lanka by providing a secure, transparent, and
                accessible platform that empowers individuals and businesses to buy and sell
                with confidence.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To be Sri Lanka's leading digital marketplace that creates economic opportunities
                for everyone, fostering innovation and growth in our local communities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;