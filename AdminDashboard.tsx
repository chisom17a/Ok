
import React, { useState, useEffect } from 'react';
import { User, Transaction, ViewState } from '../types';
import { fetchAllUsers, fetchAllTransactions, updateTransactionStatus } from '../services/firebaseService';

interface AdminDashboardProps {
  user: User;
  onNavigate: (view: ViewState) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onNavigate }) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allTxs, setAllTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'withdrawals'>('overview');

  useEffect(() => {
    const loadAdminData = async () => {
      const [users, transactions] = await Promise.all([
        fetchAllUsers(),
        fetchAllTransactions()
      ]);
      setAllUsers(users);
      setAllTxs(transactions);
      setLoading(false);
    };
    loadAdminData();
  }, []);

  const pendingWithdrawals = allTxs.filter(tx => tx.type === 'Withdrawal' && tx.status === 'Pending');
  const totalPayouts = allTxs.filter(tx => tx.type === 'Withdrawal' && tx.status === 'Completed').reduce((sum, tx) => sum + tx.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <i className="fas fa-spinner fa-spin text-indigo-600 text-3xl"></i>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Admin Command Center</h1>
          <p className="text-slate-500 font-medium">Platform oversight and financial management.</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase flex items-center">
            <i className="fas fa-shield-alt mr-2"></i> Authorized: {user.name}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-2xl mb-8 w-fit">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          User Management
        </button>
        <button 
          onClick={() => setActiveTab('withdrawals')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition ${activeTab === 'withdrawals' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Payout Requests {pendingWithdrawals.length > 0 && <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingWithdrawals.length}</span>}
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Users</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{allUsers.length}</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Payouts</span>
              <div className="text-2xl font-black text-green-600 mt-1">${totalPayouts.toFixed(2)}</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Payouts</span>
              <div className="text-2xl font-black text-orange-500 mt-1">${pendingWithdrawals.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)}</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Ads</span>
              <div className="text-2xl font-black text-blue-600 mt-1">--</div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
             <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
               <h3 className="font-black text-slate-900">Recent Platform Activity</h3>
             </div>
             <div className="divide-y divide-slate-50">
               {allTxs.slice(0, 10).map(tx => {
                 const txUser = allUsers.find(u => u.id === tx.userId);
                 return (
                  <div key={tx.id} className="px-8 py-4 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center space-x-4">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'Earning' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                          <i className={`fas ${tx.type === 'Earning' ? 'fa-arrow-trend-up' : 'fa-money-bill-transfer'}`}></i>
                       </div>
                       <div>
                         <p className="text-sm font-bold text-slate-900">{tx.description || tx.type}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">{txUser?.name || 'Unknown User'} • {tx.date}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-sm font-black ${tx.type === 'Withdrawal' ? 'text-red-600' : 'text-green-600'}`}>
                         {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toFixed(2)}
                       </p>
                       <span className="text-[10px] font-black text-slate-400 uppercase">{tx.status}</span>
                    </div>
                  </div>
                 );
               })}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">User</th>
                  <th className="px-8 py-4">Role</th>
                  <th className="px-8 py-4">Balance</th>
                  <th className="px-8 py-4">Total Earned</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="px-8 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={`https://i.pravatar.cc/150?u=${u.id}`} className="w-8 h-8 rounded-lg shadow-sm" alt="" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                        u.role === 'admin' ? 'bg-red-50 text-red-600' : u.role === 'advertiser' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-sm font-bold text-slate-700">${u.balance.toFixed(2)}</td>
                    <td className="px-8 py-4 text-sm font-bold text-slate-700">${u.totalEarned.toFixed(2)}</td>
                    <td className="px-8 py-4 text-right">
                       <button className="text-slate-400 hover:text-slate-900 transition p-2"><i className="fas fa-ellipsis-v"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'withdrawals' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           {pendingWithdrawals.length > 0 ? (
             <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4">User</th>
                    <th className="px-8 py-4">Amount</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pendingWithdrawals.map(tx => {
                    const txUser = allUsers.find(u => u.id === tx.userId);
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50 transition">
                        <td className="px-8 py-4">
                          <p className="text-sm font-bold text-slate-900">{txUser?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-400">{txUser?.email}</p>
                        </td>
                        <td className="px-8 py-4 font-black text-red-600">${tx.amount.toFixed(2)}</td>
                        <td className="px-8 py-4 text-sm text-slate-500 font-medium">{tx.date}</td>
                        <td className="px-8 py-4 text-right space-x-2">
                           <button 
                            onClick={() => updateTransactionStatus(tx.id, 'Completed')}
                            className="bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition"
                           >
                            Approve
                           </button>
                           <button 
                            onClick={() => updateTransactionStatus(tx.id, 'Rejected')}
                            className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition"
                           >
                            Reject
                           </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
             </table>
           ) : (
             <div className="p-20 text-center">
                <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                   <i className="fas fa-check-circle text-2xl"></i>
                </div>
                <p className="text-slate-500 font-bold">No pending withdrawals.</p>
                <p className="text-xs text-slate-400 mt-1">The queue is empty. Good job!</p>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
