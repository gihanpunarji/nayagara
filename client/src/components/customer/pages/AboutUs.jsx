import React from 'react';
import { Users, Target, Award, Globe, Heart, TrendingUp, Shield, Truck } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { icon: Users, label: 'Active Users', value: '500K+', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { icon: Globe, label: 'Cities Covered', value: '25+', color: 'text-green-600', bgColor: 'bg-green-50' },
    { icon: Award, label: 'Years of Trust', value: '5+', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { icon: TrendingUp, label: 'Products Listed', value: '1M+', color: 'text-orange-600', bgColor: 'bg-orange-50' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We put our customers at the center of everything we do, ensuring the best shopping experience.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Your security is our priority. We maintain the highest standards of safety and trust.',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'We continuously innovate to bring you the latest technology and best user experience.',
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      icon: Truck,
      title: 'Reliable Service',
      description: 'Fast, reliable delivery and excellent customer service across Sri Lanka.',
      gradient: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-primary-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-secondary-500 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
              Our Journey to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-green-400">Excellence</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">
              Connecting Sri Lanka through trust, technology, and a commitment to providing the best online marketplace experience since 2019.
            </p>
            <div className="w-24 h-1.5 bg-primary-500 mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-green-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1">
                <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 right-0 w-32 h-32 bg-secondary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="relative bg-white p-2 rounded-3xl shadow-2xl border border-gray-100">
                  <img
                    src="/logo.png"
                    alt="Nayagara Team"
                    className="w-full h-auto rounded-2xl object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-heading font-black text-gray-100/20">NAYAGARA</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-8 flex items-center">
                <span className="w-12 h-1 bg-primary-500 mr-4 rounded-full"></span>
                Our Story
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Founded in 2019, <span className="font-bold text-primary-600">Nayagara.lk</span> began with a simple yet powerful mission: to create Sri Lanka's most trusted and user-friendly online ecosystem.
                </p>
                <p>
                  We recognized the digital gap in our beautiful island—the need for a platform that could bridge the distance between vibrant local sellers and eager customers with complete transparency, uncompromising security, and ease of use.
                </p>
                <p>
                  What started with a vision has grown into a thriving community. Today, we serve half a million active users, empowering local businesses to reach customers in every corner of the country.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">The Values We Live By</h2>
          <p className="text-lg text-gray-500">Integrity and customer obsession are at the core of everything we build.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r ${value.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                <div className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`w-12 h-12 bg-gradient-to-r ${value.gradient} rounded-xl flex items-center justify-center text-white mb-6 group-hover:rotate-6 transition-transform`}>
                    <value.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 bg-primary-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white opacity-[0.02] -skew-x-12 translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white/5 backdrop-blur-lg p-10 rounded-4xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary-500/20">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
              <div className="space-y-6">
                <p className="text-xl text-primary-100 font-medium leading-relaxed italic">
                  "To empower every Sri Lankan to shop with confidence by building the country's most trusted and customer-centric e-commerce platform."
                </p>
                <div className="h-px w-full bg-white/10"></div>
                <p className="text-gray-400 leading-relaxed">
                  අපගේ මෙහෙවර වන්නේ රටේ වඩාත්ම විශ්වාසදායක සහ පාරිභෝගික කේන්ද්‍රීය විද්‍යුත් වාණිජ්‍ය වේදිකාව ගොඩනැගීම මගින් සෑම ශ්‍රී ලාංකිකයෙකුටම විශ්වාසයෙන් යුතුව සාප්පු සවාරි යාමට බලගැන්වීමයි.
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg p-10 rounded-4xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 bg-secondary-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-secondary-500/20">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6">Our Vision</h3>
              <div className="space-y-6">
                <p className="text-xl text-secondary-100 font-medium leading-relaxed italic">
                  "To become the number one best online goods and services provider in Sri Lanka by 2030 by increasing customer satisfaction."
                </p>
                <div className="h-px w-full bg-white/10"></div>
                <p className="text-gray-400 leading-relaxed">
                  පාරිභෝගික තෘප්තිය වැඩි කිරීමෙන් 2030 වන විට ශ්‍රී ලංකාවේ අංක එකේ වඩාත් හොඳම අන්තර්ජාල භාණ්ඩ සහ සේවා සැපයුම්කරු බවට පත්වීම.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


export default AboutUs;