
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment, collection, getDocs, query, where, addDoc, orderBy, limit, runTransaction, serverTimestamp } from "firebase/firestore";
import { User as AppUser, SocialTask, Transaction } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyDHAydMwdvPKT04ZSr0m6kh_I_PZn-UGtw",
  authDomain: "cbsmartearn.firebaseapp.com",
  projectId: "cbsmartearn",
  storageBucket: "cbsmartearn.firebasestorage.app",
  messagingSenderId: "88781294371",
  appId: "1:88781294371:web:ab5122d3e38f2b55f95a96"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper for professional toast alerts
export const notify = (message: string, type: 'success' | 'error' = 'success') => {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `p-4 rounded-2xl shadow-xl flex items-center space-x-3 text-sm font-bold animate-slide-in pointer-events-auto min-w-[300px] border ${
    type === 'success' ? 'bg-white text-green-600 border-green-100' : 'bg-white text-red-600 border-red-100'
  }`;
  
  toast.innerHTML = `
    <div class="w-8 h-8 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-green-50' : 'bg-red-50'}">
      <i class="fas ${type === 'success' ? 'fa-check' : 'fa-exclamation'}"></i>
    </div>
    <div class="flex-grow">${message}</div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

export const registerUser = async (email: string, pass: string, name: string, username: string, role: 'user' | 'advertiser', referral: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    
    const userData: AppUser = {
      id: user.uid,
      name,
      email,
      balance: 0,
      referrals: 0,
      totalEarned: 0,
      role
    };

    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      username,
      referralCode: referral,
      createdAt: new Date().toISOString()
    });

    return userData;
  } catch (error: any) {
    notify(error.message, 'error');
    throw error;
  }
};

export const loginUser = async (email: string, pass: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const docSnap = await getDoc(doc(db, "users", userCredential.user.uid));
    
    if (docSnap.exists()) {
      return docSnap.data() as AppUser;
    } else {
      throw new Error("User profile not found in database.");
    }
  } catch (error: any) {
    notify(error.message, 'error');
    throw error;
  }
};

export const fetchTasks = async (userId: string) => {
  try {
    const q = query(collection(db, "tasks"), where("status", "==", "Active"));
    const tasksSnapshot = await getDocs(q);
    const allTasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialTask));
    
    const completedSnapshot = await getDocs(query(collection(db, "user_completions"), where("userId", "==", userId)));
    const completedIds = completedSnapshot.docs.map(doc => doc.data().taskId);
    
    return allTasks.map(task => ({
      ...task,
      completed: completedIds.includes(task.id)
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const fetchTransactions = async (userId: string) => {
  try {
    const q = query(collection(db, "transactions"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
    
    return txs.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

export const depositFunds = async (userId: string, amount: number) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      balance: increment(amount)
    });

    await addDoc(collection(db, "transactions"), {
      userId,
      type: 'Deposit',
      amount,
      status: 'Completed',
      date: new Date().toISOString().split('T')[0],
      description: 'Funds Added via Bank/Card'
    });

    notify(`Successfully deposited ₦${amount.toLocaleString()}`, 'success');
  } catch (error: any) {
    notify("Deposit failed", "error");
    throw error;
  }
};

export const createTaskInFirestore = async (userId: string, taskData: any) => {
  // Destructure with safety checks
  const { 
    platform = '', 
    type = '', 
    link = '', 
    proofTitle = '', 
    guide = '', 
    quantity = 0, 
    price = 0, 
    total = 0 
  } = taskData;
  
  try {
    const userRef = doc(db, "users", userId);
    const tasksRef = collection(db, "tasks");
    const transactionsRef = collection(db, "transactions");

    await runTransaction(db, async (transaction) => {
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists()) throw new Error("User not found");
      
      const balance = userSnap.data().balance || 0;
      if (balance < total) throw new Error("Insufficient balance");

      // Deduct budget
      transaction.update(userRef, { balance: balance - total });

      // Create Task
      const newTaskRef = doc(tasksRef);
      transaction.set(newTaskRef, {
        advertiserId: userId,
        platform,
        type,
        url: link,
        proofTitle,
        description: guide,
        quantity,
        remaining: quantity,
        reward: price,
        totalCost: total,
        status: "pending",
        createdAt: serverTimestamp()
      });

      // Record Transaction
      const newTxRef = doc(transactionsRef);
      transaction.set(newTxRef, {
        userId,
        type: 'Ad Spend',
        amount: total,
        status: 'Completed',
        date: new Date().toISOString().split('T')[0],
        description: `Get Audience: ${type} on ${platform}`
      });
    });

    notify("✅ Task submitted for admin approval.", "success");
  } catch (error: any) {
    notify(error.message || "Failed to submit task", "error");
    throw error;
  }
};

export const fetchTopEarners = async () => {
  try {
    const q = query(collection(db, "users"), where("role", "==", "user"), orderBy("totalEarned", "desc"), limit(10));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppUser));
  } catch (error) {
    console.error("Error fetching leaderboard", error);
    return [];
  }
};

export const fetchAdvertiserStats = async (advertiserId: string) => {
  try {
    const tasksQ = query(collection(db, "tasks"), where("advertiserId", "==", advertiserId));
    const tasksSnap = await getDocs(tasksQ);
    const tasksCount = tasksSnap.size;
    const taskIds = tasksSnap.docs.map(d => d.id);

    let totalInteractions = 0;
    if (taskIds.length > 0) {
      const chunks = [];
      for (let i = 0; i < taskIds.length; i += 10) {
        chunks.push(taskIds.slice(i, i + 10));
      }

      for (const chunk of chunks) {
        const completionsQ = query(collection(db, "user_completions"), where("taskId", "in", chunk));
        const completionsSnap = await getDocs(completionsQ);
        totalInteractions += completionsSnap.size;
      }
    }

    return { tasksCount, totalInteractions };
  } catch (error) {
    console.error("Error fetching advertiser stats", error);
    return { tasksCount: 0, totalInteractions: 0 };
  }
};

export const fetchAllUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppUser));
  } catch (error) {
    console.error("Admin: Error fetching users", error);
    return [];
  }
};

export const fetchAllTransactions = async () => {
  try {
    const snapshot = await getDocs(collection(db, "transactions"));
    const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
    return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Admin: Error fetching all transactions", error);
    return [];
  }
};

export const updateTransactionStatus = async (txId: string, status: 'Completed' | 'Rejected') => {
  try {
    await updateDoc(doc(db, "transactions", txId), { status });
    notify(`Transaction ${status.toLowerCase()}!`, 'success');
  } catch (error) {
    notify("Error updating transaction", "error");
  }
};

export const completeTaskInFirestore = async (userId: string, task: SocialTask) => {
  try {
    await addDoc(collection(db, "user_completions"), {
      userId,
      taskId: task.id,
      completedAt: new Date().toISOString()
    });

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      balance: increment(task.reward),
      totalEarned: increment(task.reward)
    });

    await addDoc(collection(db, "transactions"), {
      userId,
      type: 'Earning',
      amount: task.reward,
      status: 'Completed',
      date: new Date().toISOString().split('T')[0],
      description: `${task.type} on ${task.platform}`
    });

    notify(`Earned ₦${task.reward.toFixed(2)}!`, 'success');
  } catch (error: any) {
    notify("Failed to verify task completion", 'error');
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    notify("Password reset email sent successfully!");
  } catch (error: any) {
    notify(error.message, 'error');
  }
};
