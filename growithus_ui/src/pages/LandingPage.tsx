import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, TrendingUp, BarChart, GitBranch, Zap, Phone, ArrowRight, Leaf, DollarSign, Globe, PieChart, Users as UsersIcon } from 'lucide-react';
import LandingHeader from '@/components/LandingHeader';

import heroBackground from '@/assets/images/hero-background.jpg';
import teamCollaboration from '@/assets/images/team-collaboration.jpg';
import techBackground from '@/assets/images/tech-background.jpg';
import strategyEquity from '@/assets/images/strategy-equity.jpg';
import strategyCommodity from '@/assets/images/strategy-commodity.jpg';
import strategyForex from '@/assets/images/strategy-forex.jpg';
import strategyCrypto from '@/assets/images/strategy-crypto.jpg';

const FeatureCard: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
  <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-2 transition-all duration-300 group">
    <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl mb-6 shadow-inner-soft group-hover:scale-110 transition-transform duration-300">
      <Icon className="w-7 h-7 text-emerald-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{children}</p>
  </div>
);

const StepCard: React.FC<{ number: string; title:string; children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="relative p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl overflow-hidden h-full">
        <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-400 text-white flex items-center justify-center rounded-full font-bold text-2xl shadow-lg ring-4 ring-slate-100">
            {number}
        </div>
        <div className="ml-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600">{children}</p>
        </div>
    </div>
);

const StrategyCard: React.FC<{ imageUrl: string; title: string; children: React.ReactNode }> = ({ imageUrl, title, children }) => (
  <div className="relative p-8 rounded-2xl border border-white/50 shadow-lg overflow-hidden h-64 group flex flex-col justify-end text-white bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }}>
    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-300"></div>
    <div className="relative z-10">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="leading-relaxed opacity-90">{children}</p>
    </div>
  </div>
);

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans">
      <LandingHeader />

      {/* Hero Section */}
      <main className="relative text-white">
        <div className="absolute inset-0">
            <img src={heroBackground} alt="Financial Charts" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-32 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 animate-fade-in">
            Steady Growth, Unwavering Security.
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-200 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Discover a unique ecosystem designed for consistent 25% yearly growth. We combine collective marketing strength with transparent operations to help you compound wealth, stress-free.
          </p>
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ring-4 ring-emerald-500/20"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-3" />
            </Link>
          </div>
        </div>
      </main>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="text-gray-600 mt-3 text-lg">Your simple, three-step path to financial growth.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <StepCard number="1" title="Invest Once">A streamlined onboarding process gets you started in minutes.</StepCard>
            <StepCard number="2" title="Compound @ 25%">Our unique model delivers steady, predictable annual growth.</StepCard>
            <StepCard number="3" title="Track Everything">Monitor your portfolio with real-time reports and full transparency.</StepCard>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Image Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                    <img src={teamCollaboration} alt="Collaborative Team" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">A New Category in Investment</h2>
                    <p className="text-lg text-gray-600 mb-8">Why GrowWithUs is different from anything you've seen before.</p>
                    <div className="space-y-6">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><ShieldCheck className="w-5 h-5"/></div>
                            <div className="ml-4">
                                <h4 className="text-lg font-semibold">Zero Trading Stress</h4>
                                <p className="text-gray-600">No charts, no signals, no anxiety. Just consistent, hands-off growth.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><UsersIcon className="w-5 h-5"/></div>
                            <div className="ml-4">
                                <h4 className="text-lg font-semibold">Shared-Marketing Edge</h4>
                                <p className="text-gray-600">Our collective strength and pooled resources generate stronger results for everyone.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><GitBranch className="w-5 h-5"/></div>
                            <div className="ml-4">
                                <h4 className="text-lg font-semibold">Not a Fund, Not a Broker</h4>
                                <p className="text-gray-600">We're a unique, transparent ecosystem built for shared success.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Our Promise */}
      <section id="promise" className="relative py-24 bg-slate-900 text-white bg-cover bg-center bg-fixed" style={{backgroundImage: `url(${techBackground})`}}>
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Our Unwavering Promise</h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">Your capital, our commitment. We provide a written agreement ensuring fixed returns, year after year.</p>
          <div className="inline-block bg-white/10 backdrop-blur-md text-white rounded-2xl px-12 py-8 shadow-2xl border border-white/20">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-300">Guaranteed Annual Return</p>
            <p className="text-7xl font-extrabold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">25%</p>
          </div>
        </div>
      </section>

      {/* Diversified Strategy */}
      <section id="strategy" className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Our Diversified & Resilient Strategy</h2>
            <p className="text-gray-600 mt-3 text-lg">We guarantee returns by strategically balancing investments across four global markets.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <StrategyCard imageUrl={strategyEquity} title="Equity">Shares of top-tier global companies, selected for stability and long-term growth potential.</StrategyCard>
            <StrategyCard imageUrl={strategyCommodity} title="Commodity">Tangible assets like gold, silver, and crude oil to hedge against inflation and market volatility.</StrategyCard>
            <StrategyCard imageUrl={strategyForex} title="Forex">Strategic global currency trading to capitalize on macroeconomic trends and market movements.</StrategyCard>
            <StrategyCard imageUrl={strategyCrypto} title="Crypto">Calculated, risk-managed investments in leading digital assets like Bitcoin and Ethereum.</StrategyCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <Leaf className="w-8 h-8 text-emerald-400" />
            <span className="ml-3 text-2xl font-bold text-white">GrowWithUs</span>
          </div>
          <p className="text-slate-400 mb-8">We’d love to guide you personally. Get in touch.</p>
          <div className="flex justify-center items-center flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 mb-10">
            <a href="tel:+916268223749" className="flex items-center space-x-2 text-emerald-400 hover:text-white transition-colors text-lg">
              <Phone className="w-5 h-5" />
              <span>+91 62682 23749</span>
            </a>
            <a href="tel:+917867656787" className="flex items-center space-x-2 text-emerald-400 hover:text-white transition-colors text-lg">
              <Phone className="w-5 h-5" />
              <span>+91 78676 56787</span>
            </a>
          </div>
          <p className="text-sm text-slate-500">&copy; 2025 GrowWithUs Company. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
