import React from 'react';
import { Button } from './ui/Button';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen font-sans relative overflow-hidden bg-gray-50">
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[800px] h-[800px] rounded-full bg-blue-100/50 blur-3xl"></div>
        <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-indigo-100/40 blur-3xl"></div>
      </div>

      {/* Header - Modern Corporate */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20">
                OI
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 tracking-tight">OPEN INVOICE</span>
              </div>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#about" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Contact</a>
            </nav>

            <button
              onClick={onLoginClick}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-lg shadow-blue-600/20 transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

          <div className="inline-block mb-6 px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
            <span className="text-sm font-bold text-blue-600 tracking-wide uppercase">Next Generation Invoicing</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-8 text-slate-900 leading-tight">
            Professional <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Invoice Management
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Streamline your business operations with our powerful, intuitive invoicing solution designed for modern service businesses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-xl shadow-blue-600/20 transform hover:-translate-y-1 transition-all duration-200">
              Get Started Now
            </button>

            <button className="px-8 py-4 bg-white hover:bg-gray-50 text-slate-700 font-bold text-lg rounded-xl border border-gray-200 shadow-sm transition-all duration-200">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto border-t border-gray-100 pt-12">
            {[
              { value: '10k+', label: 'Invoices Generated' },
              { value: '500+', label: 'Active Businesses' },
              { value: '99.9%', label: 'Uptime' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              Everything Your Business Needs
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful tools to help you manage your invoices, customers, and inventory efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Smart Reporting",
                description: "Gain insights into your business performance with detailed sales and revenue reports.",
                color: "bg-blue-50 text-blue-600"
              },
              {
                icon: "👥",
                title: "Customer Management",
                description: "Keep track of your client base, their history, and preferences in one secure place.",
                color: "bg-indigo-50 text-indigo-600"
              },
              {
                icon: "⚡",
                title: "Fast Invoicing",
                description: "Create professional looking invoices in seconds and get paid faster.",
                color: "bg-emerald-50 text-emerald-600"
              }
            ].map((feature, index) => (
              <div key={index} className="p-8 rounded-2xl bg-white border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-gray-200/60 transition-all duration-300">
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center text-3xl mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 py-12 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                OI
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight">OPEN INVOICE</span>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="mb-2">contact@openinvoice.com</p>
              <p>&copy; {new Date().getFullYear()} Open Invoice. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
