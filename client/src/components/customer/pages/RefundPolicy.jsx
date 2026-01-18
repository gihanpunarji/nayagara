import React from 'react';
import { RefreshCw, Package, Clock, Shield, Mail, CheckCircle, XCircle } from 'lucide-react';

const RefundPolicy = () => {
  const policyItems = [
    {
      icon: Clock,
      title: 'Return Window',
      description: '7 Days',
      detail: 'You can return items within 7 days from the date of delivery.',
      color: 'bg-blue-500'
    },
    {
      icon: Package,
      title: 'Product Condition',
      description: 'Unused & Original Packaging',
      detail: 'Items must be in original condition with all tags and packaging intact.',
      color: 'bg-green-500'
    },
    {
      icon: RefreshCw,
      title: 'Refund Processing',
      description: '5-7 Business Days',
      detail: 'Refunds are processed within 5-7 business days after receiving the returned item.',
      color: 'bg-purple-500'
    },
    {
      icon: Shield,
      title: 'Buyer Protection',
      description: 'Safe & Secure',
      detail: 'Your purchase is protected by our buyer protection guarantee.',
      color: 'bg-orange-500'
    }
  ];

  const nonReturnableItems = [
    'Gift cards and vouchers',
    'Downloadable digital products',
    'Personalized or custom-made items',
    'Perishable goods (food, flowers, etc.)',
    'Intimate wear and cosmetics (for hygiene reasons)',
    'Products marked as final sale or clearance'
  ];

  const returnSteps = [
    {
      step: '1',
      title: 'Contact Us',
      description: 'Reach out to our customer support team within 7 days of delivery through your account or email.'
    },
    {
      step: '2',
      title: 'Return Authorization',
      description: 'Our team will review your request and provide a return authorization number if eligible.'
    },
    {
      step: '3',
      title: 'Pack & Ship',
      description: 'Securely pack the item in its original packaging and ship it to the provided return address.'
    },
    {
      step: '4',
      title: 'Inspection',
      description: 'We will inspect the returned item to ensure it meets our return policy conditions.'
    },
    {
      step: '5',
      title: 'Refund Issued',
      description: 'Once approved, your refund will be processed to your original payment method within 5-7 business days.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-600 text-white">
        <div className="px-6 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <RefreshCw className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Refund & Return Policy</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              We want you to be completely satisfied with your purchase. If you're not happy, we're here to help with easy returns and refunds.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Overview */}
      <div className="px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {policyItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <div className="text-sm text-primary-600 font-semibold mb-2">{item.description}</div>
                <p className="text-xs text-gray-600">{item.detail}</p>
              </div>
            );
          })}
        </div>

        {/* Return Eligibility */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Eligibility</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              At Nayagara.lk, we accept returns within <strong>7 days</strong> from the date of delivery.
              To be eligible for a return, your item must meet the following conditions:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>The item must be unused and in the same condition that you received it</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>It must be in the original packaging with all tags, labels, and accessories intact</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>You must provide proof of purchase (order confirmation email or receipt)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>The return request must be initiated within the 7-day return window</span>
              </li>
            </ul>
          </div>
        </div>

        {/* How to Return */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How to Return an Item</h2>
          <div className="space-y-4">
            {returnSteps.map((item, index) => (
              <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0">
                <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Information */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Processing</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Once we receive and inspect your returned item, we will send you an email notification
              to confirm that we have received your return. We will also notify you of the approval
              or rejection of your refund.
            </p>
            <p>
              <strong>If your return is approved:</strong>
            </p>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>We will initiate a refund to your original payment method</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Refund processing takes 5-7 business days</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Shipping charges from the initial purchase are non-refundable</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Depending on your bank or payment provider, it may take an additional 3-5 business days for the refund to appear in your account</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Exchanges */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Exchanges</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              If you would like to exchange your item for a different size, color, or style,
              please contact our customer support team within <strong>7 days</strong> of receiving your order.
            </p>
            <p>
              We will provide you with further instructions on how to proceed with the exchange.
              Exchanges are subject to product availability. If the desired item is not available,
              we will process a refund instead.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-900 font-semibold mb-1">Need Help with an Exchange?</p>
                  <p className="text-amber-800 text-sm">
                    Contact our customer support team at <strong>+94 71 775 0039</strong> or through
                    your account dashboard for personalized assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Non-Returnable Items */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 border border-red-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Non-Returnable Items</h2>
          <p className="text-gray-700 mb-4">
            For hygiene, safety, and quality reasons, the following items are non-returnable and non-refundable:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nonReturnableItems.map((item, index) => (
              <div key={index} className="flex items-start">
                <XCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Damaged or Defective Items */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Damaged or Defective Items</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              In the unfortunate event that your item arrives damaged or defective, please contact us
              <strong> immediately</strong> with the following information:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Your order number</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Clear photos of the damaged or defective item</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>A description of the issue</span>
              </li>
            </ul>
            <p className="mt-4">
              We will arrange for a replacement or issue a full refund, including shipping charges,
              depending on your preference and product availability.
            </p>
          </div>
        </div>

        {/* Return Shipping */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Shipping Costs</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong>Customer-Initiated Returns:</strong> You will be responsible for paying the
              shipping costs for returning your item, unless the return is due to our error.
            </p>
           
            <div className="bg-white rounded-lg p-4 border border-purple-200 mt-4">
              <p className="text-sm text-gray-600">
                <strong>Tip:</strong> We recommend using a trackable shipping service or purchasing
                shipping insurance for items over Rs. 5,000. We cannot guarantee that we will receive
                your returned item without proof of delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="text-center">
            <Mail className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Returns?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              If you have any questions or concerns regarding our refund and return policy, please
              contact our customer support team. We are here to assist you and ensure your shopping
              experience with us is enjoyable and hassle-free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center text-gray-700">
                <Mail className="w-5 h-5 text-primary-500 mr-2" />
                <span>support@nayagara.lk</span>
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-primary-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+94 71 775 0039</span>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Last updated: December 2024 | This policy applies to all purchases made on Nayagara.lk
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
