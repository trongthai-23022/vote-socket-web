"use client";
import React from 'react';

interface VoteCreationFormProps {
  title: string;
  selectedItems: string[];
  onCreateVote: () => void;
  manualOptions: string[];
}

const VoteCreationForm: React.FC<VoteCreationFormProps> = ({ title, selectedItems, manualOptions, onCreateVote }) => {
  return (
    <div className="relative">
      {/* Sticky header hiển thị số lượng đã chọn */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm py-4 mb-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Đã chọn {selectedItems.length} món
            </h2>
            <button
              onClick={onCreateVote}
              disabled={selectedItems.length + manualOptions.length < 2 || !title}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition duration-200 font-semibold text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Tạo bình chọn
            </button>
          </div>
        </div>
      </div>

      {/* Floating action button cho mobile */}
      <button
        onClick={onCreateVote}
        disabled={selectedItems.length + manualOptions.length < 2 || !title}
        className="fixed bottom-4 left-4 md:hidden bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:opacity-90 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  );
};

export default VoteCreationForm; 