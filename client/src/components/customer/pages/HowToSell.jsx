import React from 'react';
import { Link } from 'react-router-dom';
import {
    UserPlus,
    Store,
    Package,
    TrendingUp,
    CheckCircle,
    ArrowRight,
    ShieldCheck,
    Zap,
    Globe
} from 'lucide-react';

const HowToSell = () => {
    const steps = [
        {
            icon: <UserPlus className="w-8 h-8" />,
            title: "Register Your Account",
            description: "Sign up as a seller with your basic information and verify your identity.",
            color: "bg-blue-50 text-blue-600"
        },
        {
            icon: <Store className="w-8 h-8" />,
            title: "Setup Your Shop",
            description: "Enter your shop name, logo, and business details to create your storefront.",
            color: "bg-purple-50 text-purple-600"
        },
        {
            icon: <Package className="w-8 h-8" />,
            title: "List Your Products",
            description: "Add products with high-quality images and detailed descriptions to attract buyers.",
            color: "bg-orange-50 text-orange-600"
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Start Earning",
            description: "Promote your products, manage orders, and grow your business with Nayagara.",
            color: "bg-green-50 text-green-600"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-400 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
                        Become a Seller on <span className="text-primary-400">Nayagara.lk</span>
                    </h1>
                    <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
                        Join thousands of successful businesses and reach millions of customers across Sri Lanka.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://sellers.nayagara.lk/seller/register"
                            className="px-8 py-4 bg-white text-primary-700 rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
                        >
                            Get Started Now
                        </a>

                        <a
                            href="https://sellers.nayagara.lk/seller/login"
                            className="px-8 py-4 bg-primary-600 text-white border border-primary-500 rounded-xl font-bold text-lg hover:bg-primary-500 transition-all transform hover:-translate-y-1"
                        >
                            Seller Login
                        </a>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">4 Simple Steps to Success</h2>
                        <div className="w-24 h-1.5 bg-primary-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                                <div className="mt-6 flex items-center text-primary-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    Learn more <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Why Sell on Nayagara?</h2>
                        <p className="text-gray-600">We provide the tools and support you need to thrive in the e-commerce market.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Payments</h3>
                            <p className="text-gray-600">Prompt and secure payments directly to your bank account with complete transparency.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Dashboard</h3>
                            <p className="text-gray-600">Manage your inventory, orders, and customer queries from a powerful yet simple interface.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
                                <Globe className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Island-wide Reach</h3>
                            <p className="text-gray-600">Access customers from all 25 districts of Sri Lanka with our robust delivery network.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary-50">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="bg-white p-12 rounded-3xl shadow-green-lg border border-primary-100">
                        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6 underline decoration-primary-500 decoration-4">Ready to Grow Your Business?</h2>
                        <p className="text-lg text-gray-600 mb-10">
                            Join our community of sellers today and start reaching millions of customers.
                            No hidden fees, no complicated setup.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="https://sellers.nayagara.lk/seller/register"
                                className="px-10 py-4 bg-gradient-primary text-white rounded-xl font-bold text-lg hover:shadow-green-lg transition-all"
                            >
                                Register as a Seller
                            </a>

                            <Link
                                to="/contact-admin"
                                className="px-10 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all"
                            >
                                Talk to Support
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HowToSell;
