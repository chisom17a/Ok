
import React from 'react';

interface AboutProps {
  onBack: () => void;
}

const About: React.FC<AboutProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <button onClick={onBack} className="text-indigo-600 text-sm font-bold flex items-center mb-8 hover:translate-x-[-4px] transition-transform">
        <i className="fas fa-arrow-left mr-2"></i> Back
      </button>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 md:p-12">
          <h1 className="text-4xl font-black text-gray-900 mb-6">About MediaEarn</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            MediaEarn is a premier professional social media earning platform designed to bridge the gap between high-quality brands and authentic social media users. Founded in 2023, our mission is to empower everyday social media enthusiasts to monetize their time while providing advertisers with real, meaningful engagement.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                To create a sustainable ecosystem where professional engagement is rewarded fairly and brands achieve true growth through a verified network of human contributors.
              </p>
            </div>
            <div className="p-6 bg-green-50 rounded-3xl border border-green-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                To become the global standard for social media micro-tasking, leveraging AI and human creativity to redefine digital marketing.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Core Values</h2>
          <div className="space-y-6 mb-12">
            <div className="flex items-start space-x-4">
              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-2xl">
                <i className="fas fa-hand-holding-heart"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Integrity First</h4>
                <p className="text-sm text-gray-500">We prioritize honest engagement. Our verification systems ensure that both earners and advertisers get exactly what they expect.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
                <i className="fas fa-users-viewfinder"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">User Centric</h4>
                <p className="text-sm text-gray-500">The earner is our most valuable asset. We strive to provide the highest payouts and best user experience in the industry.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl">
                <i className="fas fa-microchip"></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Innovation Always</h4>
                <p className="text-sm text-gray-500">By integrating Gemini AI into our platform, we provide smart tools that help users maximize their daily efficiency and earnings.</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-[2rem] p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Join our growing team</h3>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">We are always looking for passionate people to help us build the future of social earning.</p>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
              View Open Positions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
