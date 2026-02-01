
import React, { useState, useEffect } from 'react';
import { fetchTopEarners } from '../services/firebaseService';
import { User } from '../types';

interface LeaderboardProps {
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
  const [topEarners, setTopEarners] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopEarners = async () => {
      const earners = await fetchTopEarners();
      setTopEarners(earners);
      setLoading(false);
    };
    loadTopEarners();
  }, []);

  if (loading) {
    return <div className="p-20 text-center"><i className="fas fa-spinner fa-spin text-indigo-600 text-3xl"></i></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <button onClick={onBack} className="text-indigo-600 text-sm font-bold flex items-center mb-6 hover:translate-x-[-4px] transition-transform">
        <i className="fas fa-arrow-left mr-2"></i> Dashboard
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Hall of Fame</h1>
        <p className="text-gray-500">Recognizing our most dedicated earners based on total lifetime earnings.</p>
      </div>

      {topEarners.length > 0 ? (
        <>
          {/* Podium */}
          <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-12">
            {/* 2nd Place */}
            {topEarners[1] && (
              <div className="order-2 md:order-1 flex flex-col items-center">
                <img src={`https://i.pravatar.cc/150?u=${topEarners[1].id}`} className="w-20 h-20 rounded-full border-4 border-gray-200 shadow-xl" alt="" />
                <div className="bg-white rounded-t-2xl p-6 w-40 text-center shadow-sm border border-gray-100 mt-4">
                  <p className="font-bold text-gray-900 truncate">{topEarners[1].name}</p>
                  <p className="text-indigo-600 font-extrabold">₦{topEarners[1].totalEarned.toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {topEarners[0] && (
              <div className="order-1 md:order-2 flex flex-col items-center transform md:scale-110">
                <div className="text-yellow-400 text-3xl mb-2"><i className="fas fa-crown"></i></div>
                <img src={`https://i.pravatar.cc/150?u=${topEarners[0].id}`} className="w-28 h-28 rounded-full border-4 border-yellow-400 shadow-2xl" alt="" />
                <div className="bg-white rounded-t-2xl p-6 w-48 text-center shadow-md border border-gray-100 mt-4">
                  <p className="font-bold text-gray-900 truncate">{topEarners[0].name}</p>
                  <p className="text-indigo-600 font-extrabold text-xl">₦{topEarners[0].totalEarned.toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {topEarners[2] && (
              <div className="order-3 md:order-3 flex flex-col items-center">
                <img src={`https://i.pravatar.cc/150?u=${topEarners[2].id}`} className="w-20 h-20 rounded-full border-4 border-orange-200 shadow-xl" alt="" />
                <div className="bg-white rounded-t-2xl p-6 w-40 text-center shadow-sm border border-gray-100 mt-4">
                  <p className="font-bold text-gray-900 truncate">{topEarners[2].name}</p>
                  <p className="text-indigo-600 font-extrabold">₦{topEarners[2].totalEarned.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* List */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {topEarners.slice(3).map((earner, index) => (
                <div key={earner.id} className="px-8 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-bold text-gray-400 w-4">{index + 4}</span>
                    <img src={`https://i.pravatar.cc/150?u=${earner.id}`} className="w-10 h-10 rounded-full" alt="" />
                    <p className="text-sm font-bold text-gray-900">{earner.name}</p>
                  </div>
                  <p className="text-sm font-extrabold text-indigo-600">₦{earner.totalEarned.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="p-20 text-center text-gray-400">No activity yet. Be the first to earn!</div>
      )}
    </div>
  );
};

export default Leaderboard;
