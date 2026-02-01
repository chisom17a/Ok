
import React from 'react';

interface HomeProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const Home: React.FC<HomeProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Turn Your <span className="text-indigo-600">Social Presence</span> Into Real Income.
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              The professional platform for earning money through social media engagement. Like, share, follow, and earn rewards instantly from verified global brands.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={onGetStarted}
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition transform hover:-translate-y-1 shadow-lg shadow-indigo-200"
              >
                Start Earning Now
              </button>
              <button 
                onClick={onLogin}
                className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition"
              >
                Login
              </button>
            </div>
            <div className="mt-8 flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/${i+100}/40/40`} className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-500">Joined by 50,000+ active earners</span>
            </div>
          </div>
          <div className="md:w-1/2 relative">
             <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
             <div className="absolute bottom-10 left-10 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
             <img src="https://picsum.photos/seed/dashboard/600/500" className="relative z-10 rounded-3xl shadow-2xl border-4 border-white" alt="App Preview" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Professional Earners Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We've built the most reliable infrastructure for social media monetization.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-bolt text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Instant Payouts</h3>
              <p className="text-gray-600">Withdraw your earnings directly to your bank account or crypto wallet with zero delays.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-shield-alt text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Verified Tasks</h3>
              <p className="text-gray-600">All advertisers are strictly vetted to ensure you only interact with safe, high-quality content.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6">
                <i className="fas fa-brain text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">AI Assistance</h3>
              <p className="text-gray-600">Use our built-in Gemini AI to get professional tips on how to maximize your daily income.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest mb-10">Global Partnerships</h2>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
            <i className="fab fa-google text-4xl"></i>
            <i className="fab fa-meta text-4xl"></i>
            <i className="fab fa-tiktok text-4xl"></i>
            <i className="fab fa-spotify text-4xl"></i>
            <i className="fab fa-amazon text-4xl"></i>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to join the revolution?</h2>
          <p className="text-xl text-indigo-100 mb-10">Sign up today and get a $1.00 welcome bonus on your first 10 tasks.</p>
          <button 
            onClick={onGetStarted}
            className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-xl hover:bg-gray-100 transition shadow-xl"
          >
            Create My Free Account
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
