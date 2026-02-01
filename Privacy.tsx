
import React from 'react';

interface PrivacyProps {
  onBack: () => void;
}

const Privacy: React.FC<PrivacyProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <button onClick={onBack} className="text-indigo-600 text-sm font-bold flex items-center mb-8 hover:translate-x-[-4px] transition-transform">
        <i className="fas fa-arrow-left mr-2"></i> Back
      </button>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-12">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-indigo max-w-none text-gray-600 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Data Collection</h2>
            <p className="text-sm leading-relaxed">
              We collect information you provide directly to us when you create an account, such as your name, email address, and social media handles. We also collect usage data to help verify task completion and improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li>To verify task completion and credit your earnings.</li>
              <li>To prevent fraud and maintain platform security.</li>
              <li>To process your withdrawal requests.</li>
              <li>To provide customer support and personalized earning advice via AI.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sharing of Information</h2>
            <p className="text-sm leading-relaxed">
              We do not sell your personal data. We only share necessary information with advertisers to verify task completion (e.g., your username appearing in their follower list) and with payment processors to fulfill withdrawals.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Security</h2>
            <p className="text-sm leading-relaxed">
              We implement industry-standard security measures to protect your data. Your password is encrypted, and all payment data is processed through secure, PCI-compliant gateways.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
            <p className="text-sm leading-relaxed">
              We use cookies to maintain your login session and analyze site traffic. You can manage cookie preferences through your browser settings.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-50 text-center">
          <p className="text-xs text-gray-400">For privacy concerns, contact: privacy@mediaearn.com</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
