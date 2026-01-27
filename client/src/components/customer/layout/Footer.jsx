import React from 'react';
import { Phone, MapPin, Globe, Facebook, Youtube, Linkedin, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-900 pt-0 pb-8 relative overflow-hidden border-t border-gray-100">
      {/* Top Gradient Line */}
      <div className="h-1 w-full bg-gradient-to-r from-primary-500 via-green-400 to-primary-600"></div>

      <div className="w-[90%] md:max-w-[85%] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 py-16">
          
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm">
                <img 
                  src="/logo.png" 
                  alt="Nayagara.lk" 
                  className="w-8 h-8 object-contain" 
                />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-gray-900 tracking-wide">
                  Nayagara<span className="text-primary-600">.lk</span>
                </h1>
                <p className="text-xs text-gray-500 tracking-wider uppercase">Sri Lanka's #1 Marketplace</p>
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed max-w-sm">
              Experience the best of online shopping in Sri Lanka with Nayagara. 
              We bring you a vast selection of products, ensuring quality and convenience for every customer.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4 pt-4">
              <SocialLink href="https://www.facebook.com/share/17UstB7pQY/" icon={<Facebook className="w-5 h-5" />} color="bg-[#1877F2]" />
              <SocialLink href="https://www.tiktok.com/@nayagara.lk?_t=ZS-90AAYgz3DFw&_r=1" icon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              } color="bg-black" />
              <SocialLink href="https://www.youtube.com/@Nayagara-o5w" icon={<Youtube className="w-5 h-5" />} color="bg-[#FF0000]" />
              <SocialLink href="https://www.linkedin.com/in/gayan-thennakoon-b63614386" icon={<Linkedin className="w-5 h-5" />} color="bg-[#0A66C2]" />
            </div>
          </div>
          
          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-heading font-semibold text-lg text-gray-900 mb-6 relative inline-block">
              Customer Service
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary-500 rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              <FooterLink href="/help-center" text="Help Center" />
              <FooterLink href="/refund-policy" text="Refund Policy" />
              <FooterLink href="/track-order" text="Track Your Order" />
              <FooterLink href="/shipping-info" text="Shipping Info" />
            </ul>
          </div>
          
          {/* About (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-semibold text-lg text-gray-900 mb-6 relative inline-block">
              Company
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary-500 rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              <FooterLink href="/about" text="About Us" />
              <FooterLink href="/contact-admin" text="Contact Admin" />
              <FooterLink href="/careers" text="Careers" />
            </ul>
          </div>
          
          {/* Contact (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-heading font-semibold text-lg text-gray-900 mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary-500 rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 group">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Hotline</p>
                  <p className="text-gray-900 font-medium">+94 71 775 0039</p>
                </div>
              </li>
              <li className="flex items-start space-x-3 group">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Email</p>
                  <p className="text-gray-900 font-medium">support@nayagara.lk</p>
                </div>
              </li>
              <li className="flex items-start space-x-3 group">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Address</p>
                  <p className="text-gray-900 font-medium">Nayagara Lanka Pvt Ltd, Anamaduwa</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-8 mt-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Nayagara.lk. All rights reserved. 
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="/privacy-policy" className="text-gray-500 hover:text-primary-600 transition-colors">Privacy Policy</a>
            <a href="/terms-conditions" className="text-gray-500 hover:text-primary-600 transition-colors">Terms & Conditions</a>
            <div className="flex items-center space-x-2 text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
              <Globe className="w-3 h-3" />
              <span className="text-xs">Developed by ZipZipy PVT LTD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper Components
const SocialLink = ({ href, icon, color }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform hover:-translate-y-1 hover:shadow-lg ${color} shadow-sm`}
  >
    {icon}
  </a>
);

const FooterLink = ({ href, text }) => (
  <li>
    <a 
      href={href} 
      className="text-gray-600 hover:text-primary-600 hover:pl-2 transition-all duration-300 flex items-center"
    >
      <span className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2 text-primary-500">
        <ArrowRight className="w-3 h-3" />
      </span>
      {text}
    </a>
  </li>
);

export default Footer;