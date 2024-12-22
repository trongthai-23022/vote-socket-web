"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "./store/user";

const Home = () => {
  const router = useRouter();
  const name = useRef("");

  const handleLogin = () => {
    if (name.current.trim()) {
      useUserStore.getState().setName(name.current);
      router.push("/create-vote");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    name.current = e.target.value;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && name.current.trim()) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg max-w-md w-full animate-fadeIn">
        <div className="text-center mb-8">
          <div className="mb-6">
            <svg className="w-20 h-20 text-indigo-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Vote for Fun
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Tạo và chia sẻ cuộc bình chọn một cách dễ dàng
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập tên của bạn"
              onChange={handleNameChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition duration-200 font-semibold text-lg shadow-md flex items-center justify-center group"
          >
            <span>Bắt đầu ngay</span>
            <svg 
              className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <div className="text-center text-gray-500 text-sm">
            Hoặc
            <button
              onClick={() => router.push("/create-vote")}
              className="text-indigo-600 hover:text-indigo-700 font-medium ml-1"
            >
              tiếp tục mà không cần đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
