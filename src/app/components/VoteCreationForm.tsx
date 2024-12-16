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
    <div>
      {/* <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tiêu đề cuộc bình chọn
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề cho cuộc bình chọn"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div> */}

      <h2 className="text-2xl font-semibold mb-4">
        Chọn món ăn ({selectedItems.length} đã chọn)
      </h2>

      <div className="fixed bottom-4 right-4">
        <button
          onClick={onCreateVote}
          disabled={selectedItems.length + manualOptions.length < 2 || !title}
          className="bg-green-600 text-white px-8 py-8 rounded-full hover:bg-green-700 disabled:opacity-50"
        >
          Tạo bình chọn
        </button>
      </div>
    </div>
  );
};

export default VoteCreationForm; 