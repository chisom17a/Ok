
import React, { useState, useEffect } from 'react';
import { User, SocialTask } from '../types';
import { getEarningAdvice, generateTaskEngagement } from '../services/geminiService';

interface AIAssistantProps {
  user: User;
  tasks: SocialTask[];
  onBack: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ user, tasks, onBack }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [engagementPrompt, setEngagementPrompt] = useState<{type: string, platform: string}>({type: 'Comment', platform: 'Instagram'});
  const [engagementResult, setEngagementResult] = useState<string>('');
  const [engagementLoading, setEngagementLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAdvice = async () => {
      const completedCount = tasks.filter(t => t.completed).length;
      const res = await getEarningAdvice(user.balance, completedCount);
      setAdvice(res || '');
      setLoading(false);
    };
    fetchAdvice();
  }, [user.balance, tasks]);

  const handleGenerateEngagement = async () => {
    setEngagementLoading(true);
    const res = await generateTaskEngagement(engagementPrompt.type, engagementPrompt.platform);
    setEngagementResult(res || '');
    setEngagementLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={onBack} className="text-indigo-600 text-sm font-bold flex items-center mb-6 hover:underline">
        <i className="fas fa-arrow-left mr-2"></i> Dashboard
      </button>

      <div className="mb-8 flex items-center space-x-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <i className="fas fa-robot text-white text-xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Gemini Earning Assistant</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strategic Advice Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <i className="fas fa-lightbulb text-yellow-500 mr-2"></i> Strategic Insights
          </h3>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <i className="fas fa-circle-notch fa-spin text-indigo-600 text-2xl mb-4"></i>
              <p className="text-sm text-gray-500">Analyzing your profile performance...</p>
            </div>
          ) : (
            <div className="prose prose-indigo max-w-none text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
              {advice}
            </div>
          )}
        </div>

        {/* Task Helper Tool */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <i className="fas fa-pen-fancy text-blue-500 mr-2"></i> Engagement Helper
          </h3>
          <p className="text-sm text-gray-500 mb-6">Struggling with what to post or comment? Let Gemini write it for you.</p>
          
          <div className="space-y-4 mb-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Platform</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
                  value={engagementPrompt.platform}
                  onChange={(e) => setEngagementPrompt({...engagementPrompt, platform: e.target.value})}
                >
                  <option>Instagram</option>
                  <option>Twitter</option>
                  <option>TikTok</option>
                  <option>YouTube</option>
                  <option>LinkedIn</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Task Type</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm"
                  value={engagementPrompt.type}
                  onChange={(e) => setEngagementPrompt({...engagementPrompt, type: e.target.value})}
                >
                  <option>Comment</option>
                  <option>Post Caption</option>
                  <option>Direct Message</option>
                  <option>Review</option>
                </select>
              </div>
            </div>
            <button 
              onClick={handleGenerateEngagement}
              disabled={engagementLoading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              {engagementLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Generate Engagement'}
            </button>
          </div>

          {engagementResult && (
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl relative">
              <p className="text-sm text-indigo-900 italic">"{engagementResult}"</p>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(engagementResult);
                  alert('Copied!');
                }}
                className="absolute top-2 right-2 text-indigo-400 hover:text-indigo-600"
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Want Premium AI Insights?</h2>
            <p className="text-indigo-100">Upgrade to MediaEarn Pro for automated task execution and high-yield alerts.</p>
          </div>
          <button className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition shadow-xl">
            Go Pro Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
