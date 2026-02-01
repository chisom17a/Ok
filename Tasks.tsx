
import React, { useState } from 'react';
import { User, SocialTask } from '../types';

interface TasksProps {
  user: User;
  tasks: SocialTask[];
  onCompleteTask: (id: string) => void;
  onBack: () => void;
}

const Tasks: React.FC<TasksProps> = ({ user, tasks, onCompleteTask, onBack }) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Instagram' | 'Twitter' | 'YouTube'>('All');
  const [showVerification, setShowVerification] = useState<string | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(false);

  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'All') return true;
    return t.platform === activeTab;
  });

  const handleExecute = (task: SocialTask) => {
    window.open(task.url, '_blank');
    setShowVerification(task.id);
  };

  const handleVerify = (taskId: string) => {
    setVerificationLoading(true);
    setTimeout(() => {
      onCompleteTask(taskId);
      setVerificationLoading(false);
      setShowVerification(null);
    }, 2000);
  };

  const todayProfit = tasks
    .filter(t => t.completed)
    .reduce((acc, t) => acc + t.reward, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-[600px]">
      {showVerification && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowVerification(null)}></div>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl animate-scale-up">
            <h3 className="text-xl font-bold text-gray-900 text-center">Verify Task</h3>
            <button 
               onClick={() => handleVerify(showVerification)}
               disabled={verificationLoading}
               className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center"
            >
              {verificationLoading ? <i className="fas fa-spinner fa-spin mr-2"></i> : 'Confirm Submission'}
            </button>
          </div>
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <button onClick={onBack} className="text-indigo-600 text-sm font-bold mb-2">
            <i className="fas fa-arrow-left mr-2"></i> Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Task Marketplace</h1>
        </div>
        <div className="bg-green-50 px-6 py-3 rounded-2xl border border-green-100 text-right">
          <span className="text-[10px] text-green-600 font-extrabold uppercase">Today's Profit</span>
          <div className="text-xl font-extrabold text-green-700">₦{todayProfit.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.map(task => (
          <div key={task.id} className="bg-white border border-gray-100 p-6 rounded-3xl flex justify-between items-center">
            <div className="flex items-center space-x-4">
               <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <i className={`fab fa-${task.platform.toLowerCase()} text-xl`}></i>
               </div>
               <div>
                  <h3 className="font-bold text-gray-900">{task.type}</h3>
                  <p className="text-sm text-gray-500">{task.description}</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-xl font-black text-green-600">₦{task.reward.toFixed(2)}</p>
               {!task.completed ? (
                 <button onClick={() => handleExecute(task)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold mt-2">Earn</button>
               ) : (
                 <span className="text-green-600 text-xs font-bold"><i className="fas fa-check-circle mr-1"></i> Paid</span>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
