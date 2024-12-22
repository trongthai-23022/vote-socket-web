"use client";

import React, { useRef } from "react";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";
import useUserStore from "../store/user";

export default function LoginPage() {
  const router = useRouter();
  const nameRef = useRef<string>("");
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect") || "/create-vote-page";
  
  const handleLogin = () => {
    if (nameRef.current.trim()) {
      useUserStore.getState().setName(nameRef.current);
      router.push(redirectUrl);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    nameRef.current = e.target.value;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg max-w-md w-full animate-fadeIn">
        <div className="text-center mb-8">
          <div className="mb-4">
            <svg className="w-16 h-16 text-indigo-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Chào mừng!</h2>
          <p className="text-gray-600">Vui lòng nhập tên của bạn để tiếp tục</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Nhập tên của bạn"
              onChange={handleNameChange}
              onKeyPress={handleKeyPress}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200"
              required
            />
          </div>
          
          <Button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition duration-200 font-semibold text-lg shadow-md flex items-center justify-center group"
          >
            <span>Tiếp tục</span>
            <svg 
              className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
