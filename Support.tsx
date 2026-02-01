
import React, { useState } from 'react';

interface SupportProps {
  onBack: () => void;
}

const Support: React.FC<SupportProps> = ({ onBack }) => {
  const [formState, setFormState] = useState({ subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormState({ subject: '', message: '' });
  };

  const faqs = [
    { q: "How long do withdrawals take?", a: "Standard bank withdrawals take 24-48 hours. Crypto withdrawals are near-instant once verified." },
    { q: "Why was my task rejected?", a: "Tasks are rejected if the screenshot is blurry, missing, or doesn't show the required engagement (e.g., following the account)." },
    { q: "What is the minimum withdrawal amount?", a: "The minimum threshold is currently $10.00 to ensure sustainable transaction processing." },
    { q: "Can I use multiple accounts?", a: "No, our anti-fraud system prohibits multiple accounts per person. Doing so will result in a permanent ban." },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={onBack} className="text-indigo-600 text-sm font-bold flex items-center mb-6 hover:underline">
        <i className="fas fa-arrow-left mr-2"></i> Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Support Center</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
               <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                    <i className="fas fa-envelope-open-text text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Email Us</p>
                    <p className="text-sm font-bold text-gray-900">help@mediaearn.com</p>
                  </div>
               </div>
               <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm">
                    <i className="fab fa-whatsapp text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Live Chat</p>
                    <p className="text-sm font-bold text-gray-900">+1 800 555 EARN</p>
                  </div>
               </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <details key={i} className="group border border-gray-100 rounded-2xl p-4 hover:border-indigo-200 transition">
                  <summary className="font-bold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                    {faq.q}
                    <i className="fas fa-chevron-down text-gray-300 group-open:rotate-180 transition-transform"></i>
                  </summary>
                  <p className="mt-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Open a Ticket</h3>
            
            {submitted ? (
              <div className="text-center py-8 animate-bounce-slow">
                <i className="fas fa-check-circle text-5xl text-green-500 mb-4"></i>
                <p className="font-bold text-gray-900">Ticket Submitted!</p>
                <p className="text-xs text-gray-500 mt-2">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Subject</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Withdrawal Issue" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={formState.subject}
                    onChange={e => setFormState({...formState, subject: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Message</label>
                  <textarea 
                    required
                    placeholder="Describe your problem in detail..." 
                    rows={4}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                    value={formState.message}
                    onChange={e => setFormState({...formState, message: e.target.value})}
                  ></textarea>
                </div>
                <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                  Submit Request
                </button>
              </form>
            )}
            
            <div className="mt-8 pt-8 border-t border-gray-50">
              <p className="text-xs text-gray-400 text-center">
                Operating Hours: Mon-Fri, 9AM - 6PM EST
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
