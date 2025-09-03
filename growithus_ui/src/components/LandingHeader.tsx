import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, TrendingUp, ArrowRight } from 'lucide-react';

const LandingHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                <Leaf className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 bg-clip-text text-transparent">
                GrowWithUs
              </h1>
            </div>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-6 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-emerald-600 hover:scale-105 transition-all duration-300 flex items-center"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
