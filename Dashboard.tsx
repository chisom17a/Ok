
import React from 'react';
import { User, SocialTask, ViewState } from '../types';

interface DashboardProps {
  user: User;
  tasks: SocialTask[];
  onNavigate: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, tasks, onNavigate }) => {
  const completedCount = tasks.filter(t => t.completed).length;
  const availableCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, Earner {user.name.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500">Track your daily engagement and maximize your rewards.</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button 
            onClick={() => onNavigate(ViewState.TASKS)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition flex items-center"
          >
            <i className="fas fa-play-circle mr-2"></i> Earn Money
          </button>
          <button 
             onClick={() => onNavigate(ViewState.AI_ASSISTANT)}
             className="bg-white text-indigo-600 border border-indigo-200 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition flex items-center"
          >
            <i className="fas fa-robot mr-2"></i> AI Advisor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Available</span>
          <div className="text-2xl font-black text-gray-900 mt-1">₦{user.balance.toLocaleString()}</div>
          <div className="mt-2 text-[10px] font-bold text-green-600 uppercase tracking-widest">Withdrawal ready</div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Task Score</span>
          <div className="text-2xl font-black text-gray-900 mt-1">{completedCount}</div>
          <div className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{availableCount} available</div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Referral Bonus</span>
          <div className="text-2xl font-black text-gray-900 mt-1">₦{(user.referrals * 500).toLocaleString()}</div>
          <div className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.referrals} referred</div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Lifetime</span>
          <div className="text-2xl font-black text-gray-900 mt-1">₦{user.totalEarned.toLocaleString()}</div>
          <div className="mt-2 text-[10px] font-bold text-yellow-600 uppercase tracking-widest">Verified earnings</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
              <h3 className="font-bold text-gray-900">Task Marketplace</h3>
              <button onClick={() => onNavigate(ViewState.TASKS)} className="text-sm font-bold text-indigo-600">View All</button>
            </div>
            <div className="divide-y divide-gray-50">
              {tasks.filter(t => !t.completed).slice(0, 5).map(task => (
                <div key={task.id} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                      <i className={`fab fa-${task.platform.toLowerCase()} text-xl`}></i>
                    </div>
                    <div>
                      <div className="text-sm font-black text-gray-900">{task.type} on {task.platform}</div>
                      <div className="text-xs text-gray-500">{task.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-green-600">+₦{task.reward.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
             <h3 className="text-xl font-bold mb-4">Invite Friends</h3>
             <p className="text-sm text-indigo-100 mb-6">Earn ₦500 for every active referral.</p>
             <button onClick={() => onNavigate(ViewState.REFERRALS)} className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-bold text-sm">Share Link</button>
           </div>

           <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
             <h3 className="font-bold text-gray-900 mb-4">Withdrawal</h3>
             <div className="flex items-end space-x-2 mb-6">
               <span className="text-4xl font-black text-gray-900">₦{user.balance.toLocaleString()}</span>
               <span className="text-xs text-gray-400 mb-2 font-bold uppercase">/ ₦5,000 min</span>
             </div>
             <button 
                onClick={() => onNavigate(ViewState.WALLET)}
                className={`w-full py-4 rounded-2xl font-black text-sm transition ${user.balance >= 5000 ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-400'}`}
                disabled={user.balance < 5000}
              >
               {user.balance >= 5000 ? 'Withdraw Funds' : 'Minimum ₦5,000 required'}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
