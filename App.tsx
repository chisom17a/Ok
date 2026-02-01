
import React, { useState, useEffect } from 'react';
import { ViewState, User, SocialTask, Transaction } from './types';
import { auth, db, fetchTasks, fetchTransactions, completeTaskInFirestore, notify } from './services/firebaseService';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import AdvertiserDashboard from './views/AdvertiserDashboard';
import AdminDashboard from './views/AdminDashboard';
import Auth from './views/Auth';
import Tasks from './views/Tasks';
import Wallet from './views/Wallet';
import Referrals from './views/Referrals';
import AIAssistant from './views/AIAssistant';
import Leaderboard from './views/Leaderboard';
import Support from './views/Support';
import Profile from './views/Profile';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<SocialTask[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (uid: string, role: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUser(userSnap.data() as User);
      }

      if (role === 'admin') {
        setTasks([]);
        setTransactions([]);
        return;
      }

      const [fetchedTasks, fetchedTransactions] = await Promise.all([
        fetchTasks(uid),
        fetchTransactions(uid)
      ]);
      
      setTasks(fetchedTasks);
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Data sync error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docSnap = await getDoc(doc(db, "users", firebaseUser.uid));
          if (docSnap.exists()) {
            const userData = docSnap.data() as User;
            setUser(userData);
            await loadUserData(firebaseUser.uid, userData.role);
            
            setView(prev => {
              const landingViews: ViewState[] = [ViewState.HOME, ViewState.LOGIN, ViewState.REGISTER, ViewState.FORGOT_PASSWORD];
              if (landingViews.includes(prev)) {
                return userData.role === 'admin' ? ViewState.ADMIN_DASHBOARD : ViewState.DASHBOARD;
              }
              return prev;
            });
          } else {
            setUser(null);
            setView(ViewState.HOME);
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setUser(null);
        setTasks([]);
        setTransactions([]);
        setView(prev => {
           const authSubPages: ViewState[] = [ViewState.LOGIN, ViewState.REGISTER, ViewState.FORGOT_PASSWORD];
           return authSubPages.includes(prev) ? prev : ViewState.HOME;
        });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    loadUserData(u.id, u.role);
    if (u.role === 'admin') setView(ViewState.ADMIN_DASHBOARD);
    else setView(ViewState.DASHBOARD);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setView(ViewState.HOME);
  };

  const completeTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed && user) {
      try {
        await completeTaskInFirestore(user.id, task);
        await loadUserData(user.id, user.role);
      } catch (err) {
        notify("Verification failed.", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderView = () => {
    const refresh = () => user && loadUserData(user.id, user.role);
    
    switch (view) {
      case ViewState.HOME:
        return <Home onGetStarted={() => setView(ViewState.REGISTER)} onLogin={() => setView(ViewState.LOGIN)} />;
      case ViewState.LOGIN:
      case ViewState.REGISTER:
      case ViewState.FORGOT_PASSWORD:
        return (
          <Auth 
            mode={view === ViewState.LOGIN ? 'login' : view === ViewState.REGISTER ? 'register' : 'forgot-password'} 
            onAuthSuccess={handleLogin} 
            onSwitch={(newMode) => setView(newMode === 'login' ? ViewState.LOGIN : newMode === 'register' ? ViewState.REGISTER : ViewState.FORGOT_PASSWORD)} 
            onBack={() => setView(ViewState.HOME)} 
          />
        );
      case ViewState.DASHBOARD:
        if (!user) return <Home onGetStarted={() => setView(ViewState.REGISTER)} onLogin={() => setView(ViewState.LOGIN)} />;
        if (user.role === 'admin') return <AdminDashboard user={user} onNavigate={setView} />;
        return user.role === 'advertiser' ? (
          <AdvertiserDashboard user={user} onNavigate={setView} onRefresh={refresh} />
        ) : (
          <Dashboard user={user} tasks={tasks} onNavigate={setView} />
        );
      case ViewState.ADMIN_DASHBOARD:
        return user && user.role === 'admin' ? <AdminDashboard user={user} onNavigate={setView} /> : <Home onGetStarted={() => setView(ViewState.REGISTER)} onLogin={() => setView(ViewState.LOGIN)} />;
      case ViewState.TASKS:
        return user ? <Tasks user={user} tasks={tasks} onCompleteTask={completeTask} onBack={() => setView(ViewState.DASHBOARD)} /> : null;
      case ViewState.WALLET:
        return user ? <Wallet user={user} transactions={transactions} onBack={() => setView(ViewState.DASHBOARD)} onRefresh={refresh} /> : null;
      case ViewState.REFERRALS:
        return user ? <Referrals user={user} onBack={() => setView(ViewState.DASHBOARD)} /> : null;
      case ViewState.AI_ASSISTANT:
        return user ? <AIAssistant user={user} tasks={tasks} onBack={() => setView(ViewState.DASHBOARD)} /> : null;
      case ViewState.LEADERBOARD:
        return user ? <Leaderboard onBack={() => setView(ViewState.DASHBOARD)} /> : null;
      case ViewState.PROFILE:
        return user ? <Profile user={user} onBack={() => setView(ViewState.DASHBOARD)} onLogout={handleLogout} /> : null;
      default:
        return <Home onGetStarted={() => setView(ViewState.REGISTER)} onLogin={() => setView(ViewState.LOGIN)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => setView(user ? (user.role === 'admin' ? ViewState.ADMIN_DASHBOARD : ViewState.DASHBOARD) : ViewState.HOME)}>
          <div className="bg-indigo-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
            <i className="fas fa-chart-line text-white text-lg"></i>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">MediaEarn</span>
        </div>
        <div className="flex items-center space-x-4">
          {!user ? (
            <button onClick={() => setView(ViewState.LOGIN)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold">Join Now</button>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-indigo-600">₦{user.balance.toLocaleString()}</span>
              <button onClick={() => setView(ViewState.PROFILE)} className="text-gray-400 hover:text-indigo-600"><i className="fas fa-user-circle text-xl"></i></button>
            </div>
          )}
        </div>
      </nav>
      <main className="flex-grow">{renderView()}</main>
    </div>
  );
};

export default App;
