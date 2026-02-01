
import React, { useState } from 'react';
import { User, Transaction } from '../types';
import { depositFunds } from '../services/firebaseService';

interface WalletProps {
  user: User;
  transactions: Transaction[];
  onBack: () => void;
  onRefresh: () => void;
}

const Wallet: React.FC<WalletProps> = ({ user, transactions, onBack, onRefresh }) => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(5000);
  const [loading, setLoading] = useState(false);
  
  const isAdvertiser = user.role === 'advertiser';
  const withdrawals = transactions.filter(tx => tx.type === 'Withdrawal');

  const handleDeposit = async () => {
    setLoading(true);
    try {
      await depositFunds(user.id, depositAmount);
      setShowDepositModal(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {showDepositModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !loading && setShowDepositModal(false)}></div>
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full relative z-10 shadow-2xl animate-scale-up text-center">
            <h3 className="text-2xl font-black text-slate-900 mb-6">Top Up Ad Credits</h3>
            
            <div className="space-y-4 mb-8">
               <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <button onClick={() => setDepositAmount(Math.max(1000, depositAmount - 1000))} className="w-10 h-10 bg-white shadow-sm rounded-xl font-black text-slate-400 hover:text-indigo-600 transition">-</button>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Amount</p>
                    <p className="text-3xl font-black text-slate-900">₦{depositAmount.toLocaleString()}</p>
                  </div>
                  <button onClick={() => setDepositAmount(depositAmount + 1000)} className="w-10 h-10 bg-white shadow-sm rounded-xl font-black text-slate-400 hover:text-indigo-600 transition">+</button>
               </div>
            </div>

            <button 
              disabled={loading}
              onClick={handleDeposit}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : `Deposit ₦${depositAmount.toLocaleString()}`}
            </button>
            <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">Pay via Paystack / Bank</p>
          </div>
        </div>
      )}

      <button onClick={onBack} className="text-indigo-600 text-sm font-bold flex items-center mb-6 hover:underline">
        <i className="fas fa-arrow-left mr-2"></i> Dashboard
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="md:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative">
            <span className="text-indigo-200 font-semibold text-sm">
              {isAdvertiser ? 'Ad Credits Available' : 'Available for Withdrawal'}
            </span>
            <div className="text-5xl font-extrabold mt-2 mb-6">₦{user.balance.toLocaleString()}</div>
            <button 
              onClick={() => isAdvertiser ? setShowDepositModal(true) : null}
              className="bg-white text-indigo-600 px-8 py-3.5 rounded-2xl font-black hover:bg-indigo-50 transition shadow-xl"
            >
              {isAdvertiser ? 'Deposit Funds' : 'Withdraw Now'}
            </button>
          </div>
          <div className="p-6 flex justify-between">
             <div>
               <p className="text-xs font-bold text-gray-400 uppercase">Lifetime Total</p>
               <p className="text-xl font-bold text-gray-900">₦{user.totalEarned.toLocaleString()}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30">
          <h3 className="font-bold text-gray-900">Transaction History</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="px-8 py-4">Description</th>
              <th className="px-8 py-4">Date</th>
              <th className="px-8 py-4">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td className="px-8 py-4 text-sm font-bold text-gray-700">{tx.description || tx.type}</td>
                <td className="px-8 py-4 text-sm text-gray-500">{tx.date}</td>
                <td className={`px-8 py-4 font-black ${tx.type === 'Withdrawal' || tx.type === 'Ad Spend' ? 'text-red-600' : 'text-green-600'}`}>
                  {tx.type === 'Withdrawal' || tx.type === 'Ad Spend' ? '-' : '+'}₦{tx.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Wallet;
