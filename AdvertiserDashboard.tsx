
import React, { useState, useEffect } from 'react';
import { User, SocialTask, ViewState } from '../types';
import { createTaskInFirestore, fetchAdvertiserStats } from '../services/firebaseService';

interface AdvertiserDashboardProps {
  user: User;
  onNavigate: (view: ViewState) => void;
  onRefresh: () => void;
}

const TASK_TYPES_CONFIG: Record<string, {n: string, p: number}[]> = {
  WhatsApp:[{n:"Group Join/channel",p:30},{n:"Status Post",p:40},{n:"Channel Join and Like",p:40},{n:"Channel React No Join",p:15},{n:"Message Sending",p:40}],
  Telegram:[{n:"Group Join",p:20},{n:"Channel Follow",p:20},{n:"Simple Bot",p:35},{n:"Complex Bot",p:50},{n:"Web Bot",p:50}],
  Instagram:[{n:"Follow",p:30},{n:"Post Like",p:7},{n:"Comment",p:8},{n:"Post View",p:6},{n:"Live Engagement",p:20}],
  Facebook:[{n:"Like Page / Follow",p:15},{n:"Group Join",p:30},{n:"Post Like",p:7},{n:"Comment",p:20},{n:"Post Share",p:15},{n:"Video View",p:10},{n:"Post On Facebook",p:20},{n:"Page / Business Review",p:20}],
  Twitter:[{n:"Follow",p:15},{n:"Retweet",p:15},{n:"Comment",p:10},{n:"Like",p:8},{n:"Vote",p:20},{n:"Post On X",p:30}],
  TikTok:[{n:"Follow",p:15},{n:"Like",p:8},{n:"Comment",p:9},{n:"Video View",p:20},{n:"Repost",p:20},{n:"Add To Favourite",p:10},{n:"Use Sound",p:50}],
  YouTube:[{n:"Subscribe",p:25},{n:"Like Video",p:5},{n:"Comment",p:12},{n:"Video View",p:20},{n:"Video Share",p:20}],
  Website:[{n:"Interact With Website",p:15},{n:"Simple Sign Up",p:35},{n:"Blog Comment",p:15},{n:"Review",p:20},{n:"Complex Sign Up",p:50}],
  Gmail:[{n:"Email Creation",p:70},{n:"Email Sell",p:100}],
  Audiomack:[{n:"Stream Music",p:35},{n:"Music Comment",p:15},{n:"Music Like",p:10},{n:"Add To Favourite",p:15},{n:"Page Follow",p:20}],
  Boomplay:[{n:"Stream Music",p:35},{n:"Music Comment",p:15},{n:"Music Like",p:10},{n:"Add To Favourite",p:15},{n:"Page Follow",p:20}],
  Spotify:[{n:"Stream Music",p:40},{n:"Music Like",p:25},{n:"Add To Playlist",p:25},{n:"Page Follow",p:20}],
  Threads:[{n:"Post Like",p:19},{n:"Comment",p:15},{n:"Follow",p:15},{n:"Repost",p:20}]
};

const AdvertiserDashboard: React.FC<AdvertiserDashboardProps> = ({ user, onNavigate, onRefresh }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ tasksCount: 0, totalInteractions: 0 });
  
  // State aligns with Firestore expectations: 'quantity' instead of 'amount'
  const [form, setForm] = useState({
    platform: '',
    type: '',
    price: 0,
    link: '',
    proofTitle: '',
    guide: '',
    quantity: 10
  });

  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchAdvertiserStats(user.id);
      setStats(data);
    };
    loadStats();
  }, [user.id, showCreateModal]);

  const handlePlatformChange = (p: string) => {
    setForm({ ...form, platform: p, type: '', price: 0 });
    setTotalCost(0);
  };

  const handleTypeChange = (typeName: string) => {
    const selectedType = TASK_TYPES_CONFIG[form.platform]?.find(t => t.n === typeName);
    const price = selectedType ? selectedType.p : 0;
    setForm({ ...form, type: typeName, price });
  };

  const calculateTotal = () => {
    const total = form.quantity * form.price;
    setTotalCost(total);
    return total;
  };

  // Recalculate total whenever quantity or price changes
  useEffect(() => {
    calculateTotal();
  }, [form.quantity, form.price]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const total = calculateTotal();

    if (!form.platform || !form.type || !form.link || !form.proofTitle || form.quantity < 10) {
      alert("Complete all fields correctly. Minimum 10 people.");
      return;
    }

    if (user.balance < total) {
      alert("Insufficient balance. Please deposit funds.");
      onNavigate(ViewState.WALLET);
      return;
    }

    setLoading(true);
    try {
      await createTaskInFirestore(user.id, {
        ...form,
        total
      });
      setShowCreateModal(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !loading && setShowCreateModal(false)}></div>
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full relative z-10 shadow-2xl animate-scale-up overflow-y-auto max-h-[90vh]">
            <header className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-black text-slate-900">Create Task</h3>
              <div className="bg-indigo-50 px-4 py-1.5 rounded-full text-indigo-600 font-bold text-sm">
                ₦{user.balance.toLocaleString()}
              </div>
            </header>
            
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Platform</label>
                  <select 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.platform}
                    onChange={e => handlePlatformChange(e.target.value)}
                  >
                    <option value="">Select Platform</option>
                    {Object.keys(TASK_TYPES_CONFIG).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
               </div>

               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Task Type</label>
                  <select 
                    required
                    disabled={!form.platform}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    value={form.type}
                    onChange={e => handleTypeChange(e.target.value)}
                  >
                    <option value="">Select Task Type</option>
                    {form.platform && TASK_TYPES_CONFIG[form.platform].map(t => <option key={t.n} value={t.n}>{t.n}</option>)}
                  </select>
               </div>

               <div className="bg-slate-100 p-3 rounded-xl font-bold text-slate-700 text-sm">
                 Price per person: ₦{form.price}
               </div>

               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Task Link</label>
                 <input 
                  required
                  type="url"
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.link}
                  onChange={e => setForm({...form, link: e.target.value})}
                 />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Proof Title</label>
                   <input 
                    required
                    type="text"
                    placeholder="e.g. Screenshot or Username"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.proofTitle}
                    onChange={e => setForm({...form, proofTitle: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount (People)</label>
                   <input 
                    required
                    type="number"
                    min="10"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.quantity}
                    onChange={e => setForm({...form, quantity: parseInt(e.target.value) || 0})}
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Task Guide</label>
                 <textarea 
                  rows={2}
                  placeholder="Step by step instructions for earners..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium resize-none outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.guide}
                  onChange={e => setForm({...form, guide: e.target.value})}
                 />
               </div>

               <div className="flex space-x-2">
                 <button 
                  type="button"
                  onClick={calculateTotal}
                  className="bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-bold text-sm hover:bg-slate-300 transition"
                 >
                   Calculate Total
                 </button>
                 <div className="flex-grow bg-indigo-50 p-3 rounded-xl font-black text-indigo-700 text-center">
                    Total: ₦{totalCost.toLocaleString()}
                 </div>
               </div>

               <div className="pt-4 flex space-x-3">
                 <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition"
                 >
                   Cancel
                 </button>
                 <button 
                  disabled={loading}
                  type="submit"
                  className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition disabled:opacity-50"
                 >
                   {loading ? <i className="fas fa-spinner fa-spin"></i> : `Proceed`}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advertiser Hub: {user.name.split(' ')[0]} 🚀</h1>
          <p className="text-gray-500">Scale your presence with real-world human engagement.</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition flex items-center"
          >
            <i className="fas fa-plus-circle mr-2"></i> Get Audience
          </button>
          <button 
             onClick={() => onNavigate(ViewState.WALLET)}
             className="bg-white text-indigo-600 border border-indigo-200 px-6 py-3.5 rounded-2xl font-black hover:bg-indigo-50 transition flex items-center"
          >
            <i className="fas fa-wallet mr-2"></i> Add Funds
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Ad Balance</span>
          <div className="text-2xl font-black text-gray-900 mt-1">₦{user.balance.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Ads</span>
          <div className="text-2xl font-black text-gray-900 mt-1">{stats.tasksCount}</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Interactions</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{stats.totalInteractions.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Investment</span>
          <div className="text-2xl font-black text-green-600 mt-1">₦{user.totalEarned.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100">
         <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
           <i className="fas fa-chart-line"></i>
         </div>
         <h3 className="text-xl font-bold text-slate-900">Platform Analytics</h3>
         <p className="text-slate-500 mt-2 max-w-sm mx-auto">Real-time engagement data for your active campaigns will appear here as users complete tasks.</p>
      </div>
    </div>
  );
};

export default AdvertiserDashboard;
