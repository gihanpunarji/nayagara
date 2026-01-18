import React from 'react';
import { FileText, UserCheck, ShoppingCart, Truck, RotateCcw, Scale, AlertTriangle, Globe } from 'lucide-react';

const TermsConditions = () => {
  const keyTerms = [
    {
      icon: UserCheck,
      title: 'Account Responsibility',
      description: 'You are responsible for maintaining the confidentiality of your account credentials',
      color: 'bg-blue-500'
    },
    {
      icon: ShoppingCart,
      title: 'Purchase Agreement',
      description: 'By placing an order, you enter into a binding contract to purchase the products',
      color: 'bg-green-500'
    },
    {
      icon: Truck,
      title: 'Delivery Terms',
      description: 'Delivery times are estimates and may vary based on location and availability',
      color: 'bg-purple-500'
    },
    {
      icon: Scale,
      title: 'Governing Law',
      description: 'These terms are governed by the laws of Sri Lanka',
      color: 'bg-orange-500'
    }
  ];

  const acceptableUse = [
    {
      title: 'You May:',
      type: 'allowed',
      items: [
        'Browse and purchase products for personal use',
        'Create an account with accurate information',
        'Leave honest reviews and feedback',
        'Share products on social media'
      ]
    },
    {
      title: 'You May Not:',
      type: 'prohibited',
      items: [
        'Use the platform for any illegal activities',
        'Post false, misleading, or fraudulent listings',
        'Harass, abuse, or threaten other users',
        'Attempt to hack or disrupt the website',
        'Scrape or copy content without permission',
        'Create multiple accounts to manipulate reviews',
        'Engage in price manipulation or bid rigging'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-600 text-white">
        <div className="px-6 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <FileText className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using Nayagara.lk.
              By accessing our website, you agree to be bound by these terms.
            </p>
          </div>
        </div>
      </div>

      {/* Key Terms Overview */}
      <div className="px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {keyTerms.map((term, index) => {
            const IconComponent = term.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className={`w-12 h-12 ${term.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{term.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{term.description}</p>
              </div>
            );
          })}
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome to Nayagara.lk</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              These Terms and Conditions ("Terms") govern your access to and use of the Nayagara.lk
              website and mobile applications (collectively, the "Platform"), as well as the purchase
            </p>
            <p>
              By accessing or using our Platform, you acknowledge that you have read, understood, and
              agree to be bound by these Terms. If you do not agree with any part of these Terms,
              please do not use our Platform.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-blue-900 text-sm">
                <strong>Last Updated:</strong> December 2024 | These Terms may be updated from time to time.
                Your continued use of the Platform after any changes constitutes acceptance of the new Terms.
              </p>
            </div>
          </div>
        </div>

        {/* Use of the Website */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Use of the Website</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1.1 Eligibility</h3>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2 mt-1">•</span>
                    <span>You must be at least <strong>18 years old</strong> to create an account and make purchases on our Platform</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2 mt-1">•</span>
                    <span>By creating an account, you represent that all information you provide is accurate and current</span>
                  </li>
                  
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1.2 Account Security</h3>
              <div className="bg-amber-50 rounded-lg p-5 border border-amber-200">
                <div className="space-y-2 text-gray-700">
                  <p className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>You are responsible for maintaining the confidentiality of your account credentials, including your username and password</span>
                  </p>
                  <ul className="space-y-2 ml-7">
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>Do not share your password with anyone</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>Notify us immediately if you suspect unauthorized access to your account</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>You are responsible for all activities that occur under your account</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1.3 Prohibited Activities</h3>
              <p className="text-gray-700 mb-4">
                You agree not to use our Platform for any unlawful or prohibited purposes, including but not limited to:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span className="text-sm text-gray-700">Violating any local, state, national, or international laws</span>
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span className="text-sm text-gray-700">Transmitting malware, viruses, or harmful code</span>
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span className="text-sm text-gray-700">Impersonating others or providing false information</span>
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span className="text-sm text-gray-700">Attempting to gain unauthorized access to our systems</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acceptable Use Policy */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Acceptable Use Policy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {acceptableUse.map((section, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-blue-200">
                <h3 className={`text-lg font-semibold mb-4 ${section.type === 'allowed' ? 'text-green-700' : 'text-red-700'}`}>
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-sm text-gray-700">
                      <span className={`mr-2 flex-shrink-0 ${section.type === 'allowed' ? 'text-green-500' : 'text-red-500'}`}>
                        {section.type === 'allowed' ? '✓' : '✗'}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Product Information and Pricing */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Product Information & Pricing</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 Product Descriptions</h3>
              <p>
                We strive to provide accurate product descriptions, images, and specifications. However,
                we do not guarantee that product descriptions or other content on the Platform is
                completely accurate, current, or error-free.
              </p>
              <ul className="space-y-2 ml-6 mt-3">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>Colors may vary due to screen settings and photography lighting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>Actual product dimensions may vary slightly from listed specifications</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span>If you receive a product that differs significantly from the description, please contact us immediately</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 Pricing</h3>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>All prices are listed in Sri Lankan Rupees (LKR) unless otherwise stated</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>Prices are subject to change without notice</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>Promotions and discounts are valid for a limited time and subject to terms and conditions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>In case of pricing errors, we reserve the right to cancel orders and issue refunds</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Orders and Payments */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-start mb-6">
            <ShoppingCart className="w-8 h-8 text-primary-500 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">4. Orders & Payments</h2>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">4.1 Placing Orders</h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  By placing an order on our Platform, you are making an offer to purchase the selected
                  products at the listed price. Your order constitutes a binding contract once we send
                  you an order confirmation email.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> We reserve the right to refuse or cancel any order for any reason,
                    including but not limited to:
                  </p>
                  <ul className="text-sm text-blue-900 ml-4 mt-2 space-y-1">
                    <li>• Product unavailability or out of stock</li>
                    <li>• Errors in pricing or product information</li>
                    <li>• Suspected fraudulent or unauthorized transactions</li>
                    <li>• Violation of our Terms and Conditions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">4.2 Payment Methods</h3>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <p className="text-gray-700 mb-3">We accept the following payment methods:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Credit/Debit Cards (Visa, Mastercard)</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Online Banking (PayHere)</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Cash on Delivery (COD)</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">4.3 Payment Processing</h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  You agree to provide valid and up-to-date payment information and authorize us to
                  charge the total order amount, including applicable taxes and shipping fees, to your
                  chosen payment method.
                </p>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-sm text-purple-900">
                    <strong>Security:</strong> We use trusted third-party payment processors (PayHere, \)
                    to handle your payment information securely. We do not store or have access to your
                    full payment card details. All transactions are encrypted and PCI-DSS compliant.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping and Delivery */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100 mb-8">
          <div className="flex items-start mb-6">
            <Truck className="w-8 h-8 text-purple-600 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">5. Shipping & Delivery</h2>
            </div>
          </div>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5.1 Delivery Timeframes</h3>
              <p>
                We will make reasonable efforts to ensure timely shipping and delivery of your orders.
                However, delivery times are estimates and may vary based on:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <span className="text-sm">📍 Your delivery location</span>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <span className="text-sm">📦 Product availability</span>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <span className="text-sm">🚚 Courier service performance</span>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <span className="text-sm">🌧️ Weather and unforeseen circumstances</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5.2 Shipping Costs</h3>
              <div className="bg-white rounded-lg p-5 border border-purple-200">
                <p className="text-sm">
                  Shipping charges are calculated based on the weight, size, and destination of your order.
                  The exact shipping cost will be displayed at checkout before you complete your purchase.
                  Free shipping may be available for orders above a certain amount or during promotional periods.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5.3 Delivery Responsibility</h3>
              <p className="text-sm">
                Once the product is delivered to the address you provided, the risk of loss or damage
                passes to you. Please inspect your order upon delivery and report any issues immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Returns and Refunds */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-start mb-6">
            <RotateCcw className="w-8 h-8 text-primary-500 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">6. Returns & Refunds</h2>
              <p className="text-gray-600">Our Returns and Refund Policy governs the process and conditions for returning products</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
            <p className="text-gray-700 leading-relaxed">
              For detailed information about returns, exchanges, and refunds, please refer to our
              <a href="/refund-policy" className="text-primary-600 font-semibold hover:underline ml-1">
                Refund Policy
              </a>. By making a purchase, you acknowledge and agree to the terms outlined in that policy.
            </p>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Intellectual Property Rights</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              All content and materials on our Platform, including but not limited to text, images,
              logos, graphics, videos, software, and designs, are protected by intellectual property
              rights and are the property of Nayagara.lk or its licensors.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-lg p-5 border border-red-200">
                <h3 className="font-semibold text-gray-900 mb-2">You May NOT:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>Copy, reproduce, or distribute Platform content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>Modify or create derivative works</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>Use our trademarks without permission</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span>Remove copyright or proprietary notices</span>
                  </li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-2">You May:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>View and browse Platform content for personal use</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Share product links on social media</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Print pages for personal reference</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Request permission for commercial use</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-sm">
              Unauthorized use of our intellectual property may violate copyright, trademark, and other
              laws. Contact us if you would like to request permission for commercial use.
            </p>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Limitation of Liability</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              To the maximum extent permitted by law, Nayagara.lk, its directors, employees, affiliates,
              and partners shall not be liable for any direct, indirect, incidental, special, consequential,
              or punitive damages arising out of or in connection with:
            </p>
            <div className="bg-white rounded-lg p-5 border border-orange-200">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Your use or inability to use the Platform</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Errors or inaccuracies in product information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Delays or failures in delivery</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Loss of data or unauthorized access to your account</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Actions or conduct of third-party sellers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Any other matter relating to the Platform or products purchased</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-200 mt-4">
              <p className="text-sm">
                <strong>Disclaimer:</strong> We make no warranties or representations, express or implied,
                regarding the quality, accuracy, merchantability, fitness for a particular purpose, or
                non-infringement of products offered on our Platform.
              </p>
            </div>
          </div>
        </div>

        {/* Governing Law */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-start mb-6">
            <Scale className="w-8 h-8 text-primary-500 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">9. Governing Law & Dispute Resolution</h2>
            </div>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of
              <strong> Sri Lanka</strong>, without regard to its conflict of law provisions.
            </p>
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Dispute Resolution Process:</h3>
              <ol className="space-y-3">
                <li className="flex items-start">
                  <span className="font-semibold mr-2 text-primary-600">1.</span>
                  <div>
                    <strong>Informal Resolution:</strong> Contact our customer support team first to
                    resolve any disputes amicably.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2 text-primary-600">2.</span>
                  <div>
                    <strong>Mediation:</strong> If informal resolution fails, we agree to attempt
                    mediation before pursuing legal action.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2 text-primary-600">3.</span>
                  <div>
                    <strong>Jurisdiction:</strong> Any legal disputes shall be subject to the exclusive
                    jurisdiction of the courts of Sri Lanka.
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Amendments & Termination</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">10.1 Modifications</h3>
              <p>
                We reserve the right to modify, update, or terminate these Terms and Conditions at any
                time without prior notice. Changes will be effective immediately upon posting to the
                Platform. Your continued use of the Platform after any changes constitutes acceptance
                of the modified Terms.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">10.2 Account Termination</h3>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <p className="mb-3">We reserve the right to suspend or terminate your account if:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>You violate these Terms and Conditions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>We suspect fraudulent or illegal activity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>Your account has been inactive for an extended period</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>You request account deletion</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-600 text-white rounded-2xl p-8 shadow-lg">
          <div className="text-center">
            <Globe className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              If you have any questions or concerns about these Terms and Conditions, please contact
              our customer support team. We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white">
              <div className="flex items-center">
                <span className="mr-2">📧</span>
                <span>support@nayagara.lk</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📞</span>
                <span>+94 71 775 0039</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📍</span>
                <span>Anamaduwa, Sri Lanka</span>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Last updated: December 2024 | These Terms and Conditions apply to all users of Nayagara.lk
          </p>
          <p className="text-xs text-gray-400 mt-2">
            By using our Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
