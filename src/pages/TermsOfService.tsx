import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, TrendingUp } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-teal-50/50 to-cyan-50/50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                  <TrendingUp className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                  GrowWithUs
                </h1>
                <p className="text-xs text-gray-500 font-medium">COMPANY</p>
              </div>
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 flex items-center space-x-2 text-sm"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last Updated: October 26, 2025</p>

          <div className="prose prose-emerald max-w-none text-gray-700">
            <p>
              Welcome to GrowWithUs! These Terms of Service ("Terms") govern your use of the GrowWithUs website, applications, and services (collectively, the "Service"), operated by GrowWithUs Company. Please read these Terms carefully before using the Service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By creating an account, accessing, or using the Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not use the Service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Accounts</h2>
            <p>
              You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Investment Risks</h2>
            <p>
              Investing in securities involves risk, and there is always the potential of losing money when you invest in securities. Past performance is not a guarantee of future results. GrowWithUs is not a financial advisor, and the Service is not intended to provide financial advice. All investment decisions are made solely by you.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Prohibited Conduct</h2>
            <p>
              You agree not to use the Service for any unlawful purpose or in any way that could harm, disable, overburden, or impair the Service. This includes, but is not limited to: engaging in market manipulation, spreading false information, or attempting to gain unauthorized access to other users' accounts.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, GrowWithUs Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of any significant changes by posting the new Terms on the Service. Your continued use of the Service after any such change constitutes your acceptance of the new Terms.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at <a href="mailto:support@growwithus.com" className="text-emerald-600 hover:underline">support@growwithus.com</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
