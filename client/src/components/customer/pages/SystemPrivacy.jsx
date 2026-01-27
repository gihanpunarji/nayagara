import React from 'react';
import { Shield, Lock, Eye, Database, Share2, Cookie, Bell, FileText } from 'lucide-react';

const SystemPrivacy = () => {
  const privacyFeatures = [
    {
      icon: Lock,
      title: 'Data Encryption',
      description: 'All sensitive data is encrypted using industry-standard SSL/TLS protocols',
      color: 'bg-blue-500'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Payment information is processed by trusted third-party payment providers',
      color: 'bg-green-500'
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'We are transparent about what data we collect and how we use it',
      color: 'bg-purple-500'
    },
    {
      icon: Database,
      title: 'Data Protection',
      description: 'Your personal information is stored securely and never sold to third parties',
      color: 'bg-orange-500'
    }
  ];

  const dataWeCollect = [
    {
      category: 'Personal Information',
      icon: FileText,
      items: [
        'Name, email address, and phone number',
        'Shipping and billing addresses',
        'Date of birth (for age verification)',
        'Profile photo (optional)'
      ]
    },
    {
      category: 'Payment Information',
      icon: Lock,
      items: [
        'Credit/debit card details (processed securely by payment providers)',
        'Payment transaction history',
        'Billing preferences'
      ]
    },
    {
      category: 'Browsing & Usage Data',
      icon: Eye,
      items: [
        'IP address and device information',
        'Browser type and version',
        'Pages visited and time spent on site',
        'Search queries and product views',
        'Shopping cart and wishlist data'
      ]
    }
  ];

  const howWeUseData = [
    {
      title: 'Order Processing & Fulfillment',
      description: 'We use your information to process orders, arrange shipping and delivery, and send order confirmations and updates.',
      icon: '📦'
    },
    {
      title: 'Customer Support',
      description: 'To respond to your inquiries, provide technical assistance, and handle returns or refunds efficiently.',
      icon: '💬'
    },
    {
      title: 'Personalization',
      description: 'To customize your shopping experience with relevant product recommendations and personalized content.',
      icon: '✨'
    },
    {
      title: 'Marketing Communications',
      description: 'To send promotional offers, newsletters, and updates about new products (you can opt-out anytime).',
      icon: '📧'
    },
    {
      title: 'Website Improvement',
      description: 'To analyze usage patterns, identify issues, and continuously improve our platform and services.',
      icon: '📊'
    },
    {
      title: 'Fraud Prevention',
      description: 'To detect and prevent fraudulent activities, unauthorized access, and abuse of our platform.',
      icon: '🛡️'
    }
  ];

  const yourRights = [
    {
      right: 'Access Your Data',
      description: 'You can request a copy of all personal information we hold about you at any time.'
    },
    {
      right: 'Correct Information',
      description: 'You have the right to update or correct any inaccurate personal information in your account.'
    },
    {
      right: 'Delete Your Account',
      description: 'You can request deletion of your account and associated personal data (subject to legal obligations).'
    },
    {
      right: 'Opt-Out of Marketing',
      description: 'You can unsubscribe from marketing emails at any time using the unsubscribe link in our emails.'
    },
    {
      right: 'Data Portability',
      description: 'You can request your data in a portable format to transfer to another service.'
    },
    {
      right: 'Withdraw Consent',
      description: 'You can withdraw consent for data processing activities where consent was the legal basis.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-600 text-white">
        <div className="px-6 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              At Nayagara.lk, we are committed to protecting your privacy and securing your personal information.
              This policy explains how we collect, use, and safeguard your data.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Features */}
      <div className="px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {privacyFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Commitment to Your Privacy</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Welcome to Nayagara.lk. Your privacy is critically important to us. This Privacy Policy
              outlines how we collect, use, protect, and share your personal information when you visit
              our website or make a purchase from our platform.
            </p>
            <p>
              By using our website, you consent to the data practices described in this policy. We
              encourage you to read this policy carefully to understand our views and practices regarding
              your personal data and how we will treat it.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-blue-900 text-sm">
                <strong>Last Updated:</strong> December 2024 | We may update this policy from time to time.
                We will notify you of any significant changes by posting a notice on our website.
              </p>
            </div>
          </div>
        </div>

        {/* Information We Collect */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Information We Collect</h2>
          <p className="text-gray-700 mb-6">
            When you visit our website or use our services, we may collect the following types of information:
          </p>
          <div className="space-y-6">
            {dataWeCollect.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                      <IconComponent className="w-5 h-5 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start text-gray-700">
                        <span className="text-primary-500 mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {howWeUseData.map((use, index) => (
              <div key={index} className="bg-white rounded-lg p-5 border border-blue-200">
                <div className="text-3xl mb-3">{use.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{use.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{use.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Information Sharing */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-start mb-6">
            <Share2 className="w-8 h-8 text-primary-500 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Information Sharing & Disclosure</h2>
              <p className="text-gray-600">We respect your privacy and do not sell your personal information to third parties.</p>
            </div>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              We may share your information only in the following limited circumstances:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Trusted Service Providers</h3>
              <p className="text-sm mb-2">
                We work with third-party companies to provide essential services such as:
              </p>
              <ul className="space-y-1 text-sm ml-4">
                <li>• Payment processing (PayHere, Stripe, etc.)</li>
                <li>• Shipping and delivery services</li>
                <li>• Cloud hosting and data storage</li>
                <li>• Email communication services</li>
                <li>• Analytics and marketing tools</li>
              </ul>
              <p className="text-sm mt-3 text-gray-600">
                These providers are contractually obligated to keep your data secure and confidential,
                and they may only use your information to provide services on our behalf.
              </p>
            </div>
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
              <h3 className="font-semibold text-gray-900 mb-3">Legal Requirements</h3>
              <p className="text-sm">
                We may disclose your information if required to do so by law or in response to valid
                legal requests, such as court orders, subpoenas, or government investigations. We may
                also share information to protect our rights, property, or safety, or that of our users.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-3">Business Transfers</h3>
              <p className="text-sm">
                In the event of a merger, acquisition, or sale of assets, your personal information
                may be transferred to the acquiring entity. We will notify you before your information
                is transferred and becomes subject to a different privacy policy.
              </p>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100 mb-8">
          <div className="flex items-start mb-6">
            <Lock className="w-8 h-8 text-purple-600 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Security</h2>
              <p className="text-gray-600">We implement industry-standard security measures to protect your information.</p>
            </div>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              We take the security of your personal information seriously and use a variety of
              technical and organizational measures to protect it from unauthorized access, alteration,
              disclosure, or destruction:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <span className="text-lg mr-2">🔐</span>
                  SSL/TLS Encryption
                </h4>
                <p className="text-sm text-gray-600">
                  All data transmitted between your browser and our servers is encrypted using HTTPS.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <span className="text-lg mr-2">🔒</span>
                  Secure Payment Processing
                </h4>
                <p className="text-sm text-gray-600">
                  We do not store full credit card details. Payments are processed by PCI-DSS compliant providers.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <span className="text-lg mr-2">🛡️</span>
                  Access Controls
                </h4>
                <p className="text-sm text-gray-600">
                  Access to personal data is restricted to authorized personnel only on a need-to-know basis.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <span className="text-lg mr-2">🔍</span>
                  Regular Security Audits
                </h4>
                <p className="text-sm text-gray-600">
                  We conduct regular security assessments and updates to protect against vulnerabilities.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200 mt-4">
              <p className="text-sm text-gray-600">
                <strong>Important:</strong> While we implement strong security measures, no method of
                transmission over the internet or electronic storage is 100% secure. We cannot guarantee
                absolute security, but we continuously work to maintain the highest standards of data protection.
              </p>
            </div>
          </div>
        </div>

        {/* Cookies and Tracking */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-start mb-6">
            <Cookie className="w-8 h-8 text-primary-500 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cookies & Tracking Technologies</h2>
              <p className="text-gray-600">We use cookies to enhance your browsing experience and analyze site usage.</p>
            </div>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Our website uses cookies and similar tracking technologies to improve functionality,
              analyze traffic, and provide personalized content. Cookies are small text files stored
              on your device that help us remember your preferences and understand how you use our site.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Types of Cookies We Use:</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm text-gray-800">Essential Cookies</h4>
                  <p className="text-sm text-gray-600">Required for the website to function properly (e.g., shopping cart, login sessions)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-800">Analytics Cookies</h4>
                  <p className="text-sm text-gray-600">Help us understand how visitors interact with our website (Google Analytics)</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-800">Marketing Cookies</h4>
                  <p className="text-sm text-gray-600">Used to deliver relevant advertisements and track campaign effectiveness</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-800">Preference Cookies</h4>
                  <p className="text-sm text-gray-600">Remember your settings and preferences (language, currency, etc.)</p>
                </div>
              </div>
            </div>
            <p className="text-sm">
              <strong>Managing Cookies:</strong> You can control and delete cookies through your browser
              settings. However, disabling certain cookies may limit your ability to use some features
              of our website.
            </p>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Privacy Rights</h2>
          <p className="text-gray-700 mb-6 text-center">
            You have the following rights regarding your personal information:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {yourRights.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-5 border border-green-200">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.right}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg p-5 border border-green-200 mt-6 text-center">
            <p className="text-sm text-gray-700">
              To exercise any of these rights, please contact us at <strong>privacy@nayagara.lk</strong> or
              through your account settings. We will respond to your request within 30 days.
            </p>
          </div>
        </div>

        {/* Children's Privacy */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Our services are not intended for children under the age of 18. We do not knowingly
              collect personal information from children under 18 years of age.
            </p>
            <p>
              If you are a parent or guardian and believe that your child has provided us with personal
              information, please contact us immediately. If we become aware that we have collected
              personal information from a child under 18 without verification of parental consent, we
              will take steps to delete that information from our servers.
            </p>
          </div>
        </div>

        {/* Changes to Privacy Policy */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-start mb-4">
            <Bell className="w-8 h-8 text-primary-500 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Changes to This Privacy Policy</h2>
            </div>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              We reserve the right to update or modify this Privacy Policy at any time to reflect
              changes in our practices, technology, legal requirements, or other factors.
            </p>
            <p>
              When we make significant changes, we will:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                <span>Post the updated policy on this page with a revised "last updated" date</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                <span>Notify you via email (if you have an account with us)</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">•</span>
                <span>Display a prominent notice on our website</span>
              </li>
            </ul>
            <p>
              We encourage you to review this Privacy Policy periodically to stay informed about how
              we collect, use, and protect your information.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-600 text-white rounded-2xl p-8 shadow-lg">
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Questions About Your Privacy?</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              If you have any questions, concerns, or requests regarding our Privacy Policy or the
              handling of your personal information, please don't hesitate to contact us.
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
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Last updated: December 2024 | This policy applies to all users of Nayagara.lk
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemPrivacy;
