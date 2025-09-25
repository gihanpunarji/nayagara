import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, CreditCard, RefreshCw, MessageSquare, Clock, Award, ChevronDown, ChevronUp } from 'lucide-react';

const BuyerProtection = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const protectionFeatures = [
    {
      icon: Shield,
      title: 'Purchase Protection',
      description: 'Every purchase is covered by our comprehensive buyer protection program.',
      details: ['Money-back guarantee', 'Product authenticity verification', 'Secure payment processing']
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Your payment information is encrypted and protected at all times.',
      details: ['SSL encryption', 'PCI DSS compliance', 'Fraud detection systems']
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: 'Hassle-free return process if items don\'t match description.',
      details: ['7-day return policy', 'Free return shipping', 'Full refund processing']
    },
    {
      icon: MessageSquare,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to resolve any issues.',
      details: ['Live chat support', 'Dispute resolution', 'Multilingual assistance']
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Shop with Confidence',
      description: 'Browse verified sellers and authentic products with detailed descriptions.'
    },
    {
      step: '2',
      title: 'Secure Checkout',
      description: 'Complete your purchase using our encrypted payment system.'
    },
    {
      step: '3',
      title: 'Delivery & Inspection',
      description: 'Receive your order and inspect it carefully upon delivery.'
    },
    {
      step: '4',
      title: 'Protection Coverage',
      description: 'If there are any issues, our protection program covers you completely.'
    }
  ];

  const faqs = [
    {
      question: 'What purchases are covered by buyer protection?',
      answer: 'All purchases made through Nayagara are covered by our buyer protection program, except for services and digital products. This includes electronics, fashion, home goods, vehicles, and more.'
    },
    {
      question: 'How long do I have to file a claim?',
      answer: 'You have 7 days from the delivery date to file a buyer protection claim. For services, the claim period is 3 days from completion.'
    },
    {
      question: 'What reasons qualify for buyer protection?',
      answer: 'Qualifying reasons include: item not received, item significantly different from description, item damaged during shipping, counterfeit products, and seller not responsive to communication.'
    },
    {
      question: 'How long does the refund process take?',
      answer: 'Once your claim is approved, refunds are processed within 3-5 business days. The time for the money to appear in your account depends on your payment method.'
    },
    {
      question: 'Do I need to return the item for a refund?',
      answer: 'In most cases, yes. We will provide a prepaid return label for items that need to be returned. For damaged or significantly misrepresented items, we may approve a refund without return.'
    },
    {
      question: 'Is there a limit to how many claims I can file?',
      answer: 'There is no limit to legitimate claims. However, we review all claims carefully and may investigate accounts with unusually high claim rates to prevent abuse.'
    }
  ];

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="px-6 py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Buyer Protection</h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Shop with confidence knowing every purchase is protected
            </p>
          </div>
        </div>
      </div>

      {/* Protection Features */}
      <div className="px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Complete Protection Coverage</h2>
        <div className="space-y-6 mb-12">
          {protectionFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Protection Works</h2>
          <div className="space-y-4">
            {howItWorks.map((step, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Protection Statistics</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">99.8%</div>
              <div className="text-sm text-gray-600">Claims Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">24hrs</div>
              <div className="text-sm text-gray-600">Average Response</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">Rs. 50M+</div>
              <div className="text-sm text-gray-600">Refunds Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">500K+</div>
              <div className="text-sm text-gray-600">Protected Purchases</div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Our customer support team is available 24/7 to assist you with any questions or concerns
              about your purchases or our buyer protection program.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <a
                href="/help"
                className="bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/help/claim"
                className="bg-white text-primary-600 py-3 px-6 rounded-lg font-medium border border-primary-600 hover:bg-primary-50 transition-colors"
              >
                File a Protection Claim
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerProtection;