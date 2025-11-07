import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Video,
  Users,
  Package,
  ShoppingCart,
  Wallet,
  BarChart3
} from 'lucide-react';
import SellerLayout from '../layout/SellerLayout';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const quickHelp = [
    {
      icon: Package,
      title: 'Adding Products',
      description: 'Learn how to list your products',
      link: '#'
    },
    {
      icon: ShoppingCart,
      title: 'Managing Orders',
      description: 'Process and track customer orders',
      link: '#'
    },
    {
      icon: Wallet,
      title: 'Payments & Withdrawals',
      description: 'Understanding payment system',
      link: '#'
    },
    {
      icon: BarChart3,
      title: 'Analytics Guide',
      description: 'Track your store performance',
      link: '#'
    }
  ];

  const faqs = [
    {
      question: 'How do I add a new product to my store?',
      answer: 'To add a new product, go to Products > Add Product. Fill in the required information including title, description, price, and upload images. Select the appropriate category and subcategory, then fill in any category-specific fields. Click "Add Product" to submit for approval.'
    },
    {
      question: 'How long does it take for products to get approved?',
      answer: 'Product approval typically takes 24-48 hours. Our team reviews each product for quality and compliance with our guidelines. You\'ll receive an email notification once your product is approved or if any changes are needed.'
    },
    {
      question: 'When will I receive payment for my sales?',
      answer: 'Payments are released to your wallet after the customer confirms order delivery and satisfaction. This usually happens 3-7 days after delivery. You can then withdraw funds to your bank account, which takes 1-2 business days.'
    },
    {
      question: 'How do I update my product inventory?',
      answer: 'Go to Products > All Products, find your product, and click Edit. Update the stock quantity and save. If stock reaches zero, the product will automatically be marked as out of stock and won\'t be visible to customers.'
    },
    {
      question: 'Can I modify product prices after listing?',
      answer: 'Yes, you can update product prices at any time. Go to Products > All Products, select your product, and edit the price. Price changes take effect immediately for new orders.'
    },
    {
      question: 'How do I handle customer returns?',
      answer: 'If a customer requests a return, they will contact you through the platform. Review the return request, communicate with the customer, and if approved, provide return instructions. Once the item is returned and verified, process the refund.'
    },
    {
      question: 'What are the selling fees?',
      answer: 'Nayagara charges a small commission on each sale to maintain the platform. The exact fee structure is available in your seller agreement. There are no listing fees or monthly charges.'
    },
    {
      question: 'How do I improve my product visibility?',
      answer: 'Use clear, descriptive titles and high-quality images. Fill in all product details and choose the correct category. Competitive pricing and good customer ratings also help improve visibility in search results.'
    }
  ];

  const resources = [
    {
      icon: Book,
      title: 'Seller Guide',
      description: 'Complete guide to selling on Nayagara',
      type: 'PDF Guide',
      link: '#'
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video tutorials',
      type: 'Video Series',
      link: '#'
    },
    {
      icon: FileText,
      title: 'Best Practices',
      description: 'Tips for successful selling',
      type: 'Article',
      link: '#'
    },
    {
      icon: Users,
      title: 'Seller Community',
      description: 'Connect with other sellers',
      type: 'Forum',
      link: '#'
    }
  ];

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      availability: 'Available 9 AM - 6 PM',
      action: 'Start Chat'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'support@nayagara.lk',
      availability: 'Response within 24 hours',
      action: 'Send Email'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: '+94 71 775 0039',
      availability: 'Mon-Fri 9 AM - 6 PM',
      action: 'Call Now'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SellerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-lg text-gray-600 mb-8">
            Get help with your seller account and learn how to succeed on Nayagara
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search help articles and FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Quick Help */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickHelp.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-4 group-hover:bg-primary-200 transition-colors">
                  <item.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {filteredFaqs.length === 0 ? (
              <div className="p-8 text-center">
                <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">
                  Try different keywords or browse our help resources below
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredFaqs.map((faq, index) => (
                  <div key={index} className="p-6">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <h3 className="font-medium text-gray-900 pr-4">{faq.question}</h3>
                      {expandedFaq === index ? (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>

                    {expandedFaq === index && (
                      <div className="mt-4 pr-8">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.link}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors">
                    <resource.icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    </div>
                    <p className="text-gray-600 mb-2">{resource.description}</p>
                    <span className="inline-block text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                      {resource.type}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-xl mx-auto mb-4">
                  <method.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-2">{method.description}</p>
                <p className="text-sm text-gray-500 mb-4">{method.availability}</p>
                <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  {method.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Help */}
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-6">
            Our seller success team is here to help you grow your business on Nayagara
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Schedule a Call
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              Send Feedback
            </button>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default Help;