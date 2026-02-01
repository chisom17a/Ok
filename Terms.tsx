
import React from 'react';

interface TermsProps {
  onBack: () => void;
}

const Terms: React.FC<TermsProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <button onClick={onBack} className="text-indigo-600 text-sm font-bold flex items-center mb-8 hover:translate-x-[-4px] transition-transform">
        <i className="fas fa-arrow-left mr-2"></i> Back
      </button>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-12">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-indigo max-w-none text-gray-600 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed">
              By accessing or using the MediaEarn platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services. We reserve the right to update these terms at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. User Accounts</h2>
            <p className="text-sm leading-relaxed">
              You must be at least 18 years old to use this platform. You are responsible for maintaining the confidentiality of your account credentials. Only one account is permitted per individual. Multiple account creation will result in a permanent ban.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Earning and Task Completion</h2>
            <p className="text-sm leading-relaxed">
              Rewards are granted only for verified task completions. We use advanced anti-fraud algorithms to detect fake engagement. False submissions, automated bot usage, or deleting engagement after receiving payment are strictly prohibited and will lead to account termination without payout.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Payouts and Withdrawals</h2>
            <p className="text-sm leading-relaxed">
              The minimum withdrawal threshold is $10.00. Processing times vary by method (usually 24-48 hours). MediaEarn reserves the right to hold payments for up to 30 days for quality assurance audits.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Advertiser Content</h2>
            <p className="text-sm leading-relaxed">
              Advertisers are responsible for the legality and safety of the URLs they promote. MediaEarn does not endorse the products or services of third-party advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed">
              MediaEarn shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the platform or any social media platform policy changes that may affect your external social accounts.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs text-gray-400">Last Updated: October 2023</p>
          <button onClick={onBack} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition">
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default Terms;
