
import React, { useState } from 'react';
import { User } from '../types';
import { registerUser, loginUser, resetPassword, notify } from '../services/firebaseService';

interface AuthProps {
  mode: 'login' | 'register' | 'forgot-password';
  onAuthSuccess: (user: User) => void;
  onSwitch: (newMode: 'login' | 'register' | 'forgot-password') => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ mode, onAuthSuccess, onSwitch, onBack }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'advertiser'>('user');
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === 'forgot-password') {
        await resetPassword(email);
        setLoading(false);
        return;
      }

      if (mode === 'register') {
        await registerUser(email, password, name, username, role, referralCode);
        setRegistrationSuccess(true);
        setLoading(false);
        notify("Account created! Please log in.", "success");
        setTimeout(() => {
          setRegistrationSuccess(false);
          onSwitch('login');
        }, 2000);
        return;
      }

      const user = await loginUser(email, password);
      onAuthSuccess(user);
      notify("Login successful. Welcome back!", "success");
    } catch (err) {
      // Errors handled by service notification
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <button onClick={onBack} className="text-indigo-600 text-sm font-semibold mb-6 flex items-center justify-center w-full hover:underline group">
            <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i> Back to Home
          </button>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Join MediaEarn' : 'Recover Password'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 px-4">
            {mode === 'login' ? 'Access your professional earning dashboard' : 
             mode === 'register' ? 'Choose your role and start your journey' : 
             'Enter your email to receive a password reset link'}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {mode !== 'forgot-password' && (
            <div className="flex bg-gray-50 border-b border-gray-100 p-1">
              <button 
                onClick={() => onSwitch('login')}
                className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${mode === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Log In
              </button>
              <button 
                onClick={() => onSwitch('register')}
                className={`flex-1 py-3 text-sm font-bold rounded-2xl transition-all ${mode === 'register' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Sign Up
              </button>
            </div>
          )}

          <div className="p-8">
            {registrationSuccess ? (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
                <p className="text-sm text-gray-500 mb-4">Registration complete. Redirecting to login...</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                {mode === 'register' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">I want to register as:</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setRole('user')}
                          className={`py-3 px-4 rounded-xl text-sm font-bold border transition ${role === 'user' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-300'}`}
                        >
                          Earner
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('advertiser')}
                          className={`py-3 px-4 rounded-xl text-sm font-bold border transition ${role === 'advertiser' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-300'}`}
                        >
                          Advertiser
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="block w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Username</label>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="block w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="johndoe"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="you@email.com"
                  />
                </div>

                {mode !== 'forgot-password' && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                )}

                {mode === 'register' && (
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Referral Code (Optional)</label>
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      className="block w-full px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="EARN123"
                    />
                  </div>
                )}

                {mode === 'login' && (
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={() => onSwitch('forgot-password')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-500 transition"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 border border-transparent rounded-2xl shadow-lg text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 
                    mode === 'login' ? 'LOG IN' : mode === 'register' ? 'SIGN UP' : 'RESET PASSWORD'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
