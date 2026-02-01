
import React from 'react';
import { User } from '../types';

interface ReferralsProps {
  user: User;
  onBack: () => void;
}

const Referrals: React.FC<ReferralsProps> = ({ user, onBack }) => {
  const referralLink = `https://mediaearn.com/join?ref=${user.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={onBack} className="text-indigo-600 text-sm font-bold flex items-center mb-6 hover:underline">
        <i className="fas fa-arrow-left mr-2"></i> Dashboard
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-10 text-center">
        <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          <i className="fas fa-gift"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refer Your Friends</h1>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">
          Share the gift of earning. For every friend who signs up and completes 5 tasks, you'll earn a <span className="text-indigo-600 font-bold">$0.50</span> bonus.
        </p>

        <div className="max-w-md mx-auto relative mb-4">
          <input 
            type="text" 
            readOnly 
            value={referralLink}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-6 text-sm font-medium text-gray-600 focus:outline-none"
          />
          <button 
            onClick={copyLink}
            className="absolute right-2 top-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition"
          >
            Copy
          </button>
        </div>
        <p className="text-xs text-gray-400">Share your link via Twitter, WhatsApp, or Facebook</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
           <div className="text-xs text-gray-400 font-bold uppercase mb-1">Total Referrals</div>
           <div className="text-2xl font-extrabold text-gray-900">{user.referrals}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
           <div className="text-xs text-gray-400 font-bold uppercase mb-1">Pending Bonus</div>
           <div className="text-2xl font-extrabold text-orange-500">$0.00</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
           <div className="text-xs text-gray-400 font-bold uppercase mb-1">Earned to Date</div>
           <div className="text-2xl font-extrabold text-green-600">${(user.referrals * 0.50).toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Your Network</h3>
        </div>
        <div className="p-8 text-center">
           {user.referrals === 0 ? (
             <>
               <i className="fas fa-users-slash text-gray-200 text-4xl mb-4"></i>
               <p className="text-gray-500">You haven't referred anyone yet. Start sharing to grow your earnings!</p>
             </>
           ) : (
             <p className="text-gray-500 font-medium">You have {user.referrals} active members in your network.</p>
           )}
        </div>
      </div>
    </div>
  );
};

export default Referrals;
