
import React from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onBack: () => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onBack, onLogout }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={onBack} className="text-indigo-600 text-sm font-bold flex items-center mb-6 hover:translate-x-[-4px] transition-transform">
        <i className="fas fa-arrow-left mr-2"></i> Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="relative inline-block mb-4">
              <img 
                src={`https://i.pravatar.cc/150?u=${user.id}`} 
                className="w-24 h-24 rounded-full border-4 border-indigo-50 shadow-lg mx-auto" 
                alt="Avatar" 
              />
              <button className="absolute bottom-0 right-0 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white hover:bg-indigo-700 transition">
                <i className="fas fa-pencil-alt text-xs"></i>
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500 mb-6">{user.email}</p>
            <div className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
              <i className="fas fa-star mr-1 text-[10px]"></i> Active Earner
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <button className="w-full flex items-center space-x-3 px-6 py-4 hover:bg-gray-50 transition border-b border-gray-50">
              <i className="fas fa-shield-alt text-gray-400"></i>
              <span className="text-sm font-semibold text-gray-700">Security & Privacy</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-6 py-4 hover:bg-gray-50 transition border-b border-gray-50">
              <i className="fas fa-bell text-gray-400"></i>
              <span className="text-sm font-semibold text-gray-700">Notifications</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-6 py-4 hover:bg-gray-50 transition border-b border-gray-50">
              <i className="fas fa-link text-gray-400"></i>
              <span className="text-sm font-semibold text-gray-700">Linked Accounts</span>
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-6 py-4 hover:bg-red-50 text-red-500 transition"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="text-sm font-bold">Logout Session</span>
            </button>
          </div>
        </div>

        {/* Right Column: Account Details & Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Account Settings</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={user.name}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={user.email}
                  readOnly
                  className="w-full bg-gray-100 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500 outline-none cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Display Username</label>
                <input 
                  type="text" 
                  defaultValue={`@${user.name.split(' ')[0].toLowerCase()}${user.id.slice(0, 3)}`}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Country</label>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option>United States</option>
                  <option>Nigeria</option>
                  <option>United Kingdom</option>
                  <option>India</option>
                  <option>Canada</option>
                </select>
              </div>
              <div className="md:col-span-2 flex justify-end pt-4">
                <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Earning Stats Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Payouts</p>
                <p className="text-xl font-bold text-gray-900">${(user.totalEarned * 0.8).toFixed(2)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Referral Rank</p>
                <p className="text-xl font-bold text-gray-900">#452</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Account Age</p>
                <p className="text-xl font-bold text-gray-900">14 Days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
