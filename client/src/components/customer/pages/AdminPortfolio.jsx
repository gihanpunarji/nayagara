import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Youtube, 
  Linkedin, 
  Send,
  MessageCircle,
  Clock,
  Globe,
  Award,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const AdminPortfolio = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 border border-blue-100">
          <div className="relative h-64 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
            <div className="absolute inset-0 opacity-20 pattern-grid-lg"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
          </div>
          
          <div className="relative px-6 sm:px-12 pb-10">
            <div className="flex flex-col md:flex-row items-end -mt-32 mb-6">
              <div className="relative group">
                <div className="w-48 h-48 rounded-2xl bg-white p-2 shadow-2xl rotate-3 transition-transform group-hover:rotate-0 duration-500">
                  <img 
                    src="/owner.jpg" 
                    alt="Owner Profile" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg border-4 border-white">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 md:ml-8 md:mb-4 flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Gayan Thennakoon</h1>
                    <p className="text-xl text-blue-600 font-medium flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Founder & CEO at Nayagara.lk
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <a 
                      href="https://wa.me/94717750039" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all shadow-lg hover:shadow-green-500/30 active:scale-95"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats/Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-3 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-900">Nayagara Lanka Pvt Ltd, Anamaduwa</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-semibold text-gray-900">+94 71 775 0039</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-900">support@nayagara.lk</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contact Details & Socials */}
          <div className="space-y-8">
            {/* About Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                  <Globe className="w-5 h-5" />
                </span>
                Online Presence
              </h3>
              
              <div className="space-y-4">
                <SocialButton 
                  href="https://www.facebook.com/share/17UstB7pQY/" 
                  icon={<Facebook className="w-6 h-6" />}
                  label="Facebook Page"
                  subLabel="Follow for updates"
                  color="bg-[#1877F2]" 
                />
                
                <SocialButton 
                  href="https://www.tiktok.com/@nayagara.lk?_t=ZS-90AAYgz3DFw&_r=1" 
                  icon={
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  }
                  label="TikTok"
                  subLabel="Watch our content"
                  color="bg-black" 
                />
                
                <SocialButton 
                  href="https://www.youtube.com/@Nayagara-o5w" 
                  icon={<Youtube className="w-6 h-6" />}
                  label="YouTube Channel"
                  subLabel="Subscribe now"
                  color="bg-[#FF0000]" 
                />

                <SocialButton 
                  href="https://www.linkedin.com/in/gayan-thennakoon-b63614386" 
                  icon={<Linkedin className="w-6 h-6" />}
                  label="LinkedIn Profile"
                  subLabel="Connect professionally"
                  color="bg-[#0A66C2]" 
                />
              </div>
            </div>

            {/* Availability Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl shadow-lg p-8 text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-3 text-yellow-400" />
                Availability
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/20 pb-3">
                  <span className="text-blue-100">Weekdays</span>
                  <span className="font-semibold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/20 pb-3">
                  <span className="text-blue-100">Weekends</span>
                  <span className="font-semibold">10:00 AM - 4:00 PM</span>
                </div>
                <div className="mt-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <p className="text-sm text-blue-100 leading-relaxed">
                    "We are dedicated to providing the best service. Feel free to reach out via WhatsApp for urgent inquiries."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100 h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send a Message</h2>
              <p className="text-gray-500 mb-8">Have a question or proposal? Drop us a line below.</p>

              {submitted ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-green-50 rounded-2xl border border-green-100">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thank you for contacting us. We will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {submitting ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Social Buttons
const SocialButton = ({ href, icon, label, subLabel, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-blue-100 transition-all duration-300 group hover:shadow-md"
  >
    <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="ml-4">
      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{label}</h4>
      <p className="text-xs text-gray-500">{subLabel}</p>
    </div>
    <div className="ml-auto text-gray-300 group-hover:text-blue-500 transition-colors">
      <ArrowRight className="w-5 h-5" />
    </div>
  </a>
);

export default AdminPortfolio;
