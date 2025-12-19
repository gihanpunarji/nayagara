import React from 'react';
import { LifeBuoy, Book, Shield, Truck, CreditCard, Mail, Phone } from 'lucide-react';

const HelpCenter = () => {
  const topics = [
    {
      icon: <Book className="w-8 h-8 text-primary-600" />,
      title: 'FAQs',
      description: 'Find answers to common questions about our products and services.',
      link: '#',
    },
    {
      icon: <Truck className="w-8 h-8 text-primary-600" />,
      title: 'Shipping & Delivery',
      description: 'Learn about our shipping process, delivery times, and fees.',
      link: '#',
    },
    // {
    //   icon: <Shield className="w-8 h-8 text-primary-600" />,
    //   title: 'Returns & Refunds',
    //   description: 'Understand our return policy and how to request a refund.',
    //   link: '#',
    // },
    {
      icon: <CreditCard className="w-8 h-8 text-primary-600" />,
      title: 'Payment Options',
      description: 'Discover the various payment methods we accept.',
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <LifeBuoy className="w-16 h-16 mx-auto text-primary-600" />
          <h1 className="text-4xl font-bold text-gray-900 mt-4">Help Center</h1>
          <p className="text-lg text-gray-600 mt-2">How can we help you today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {topics.map((topic, index) => (
            <a
              key={index}
              href={topic.link}
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                {topic.icon}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{topic.title}</h2>
                  <p className="text-gray-600 mt-1">{topic.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Still need help?</h2>
          <p className="text-lg text-gray-600 mt-2">Our support team is here for you.</p>
          <div className="mt-8 flex justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <Mail className="w-6 h-6 text-primary-600" />
              <span className="text-gray-700">info@nayagara.lk</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-6 h-6 text-primary-600" />
              <span className="text-gray-700">+94 71 775 0039</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
