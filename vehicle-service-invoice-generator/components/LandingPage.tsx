import React from 'react';
import { Button } from './ui/Button';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-primary-100 selection:text-primary-900">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img 
                src="/assets/lara-logo.jpg" 
                alt="LARA Auto Services" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-semibold tracking-tight">LARA Auto</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Our Services</a>
              <a href="#about" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">About Us</a>
              <a href="#contact" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Contact</a>
            </nav>
            <Button onClick={onLoginClick} variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
              Staff Portal
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-slate-900 mb-8">
            Premium Auto Care.
            <br />
            <span className="text-slate-400">Expert Mechanics.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10 leading-relaxed">
            Your trusted partner for vehicle maintenance and repairs. We ensure your car runs smoothly and safely.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="rounded-full px-8 py-4 text-lg shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30 transform hover:-translate-y-0.5 transition-all">
              Book Appointment
            </Button>
            <Button variant="secondary" size="lg" className="rounded-full px-8 py-4 text-lg border-slate-200 hover:bg-slate-50">
              Our Services
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose Us?</h2>
            <p className="mt-4 text-lg text-slate-500">Professional service with a personal touch.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: "🔧",
                title: "Expert Diagnostics",
                description: "State-of-the-art diagnostic tools to identify issues accurately and quickly."
              },
              {
                icon: "🛢️",
                title: "Oil & Lube",
                description: "Premium oil changes and fluid checks to keep your engine running like new."
              },
              {
                icon: "🛡️",
                title: "Brake Services",
                description: "Comprehensive brake inspections and repairs for your safety on the road."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <img 
              src="/assets/lara-logo.jpg" 
              alt="LARA Auto Services" 
              className="h-8 w-8 object-contain"
            />
            <span className="font-semibold text-slate-900">LARA Auto</span>
          </div>
          <div className="text-center md:text-right text-slate-500 text-sm">
            <p>123 Auto Park Way, Cityville</p>
            <p>(555) 123-4567 • info@laraauto.com</p>
            <p className="mt-2 text-slate-400">&copy; {new Date().getFullYear()} LARA Auto Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
