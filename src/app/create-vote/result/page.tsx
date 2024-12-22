"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CreateVoteResult() {
  const [copySuccess, setCopySuccess] = useState('');
  const searchParams = useSearchParams();
  const id = searchParams ? searchParams.get("id") : '';
  const voteUrl = typeof window !== 'undefined' ? `${window.location.origin}/vote/${id}` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(voteUrl)
      .then(() => setCopySuccess('Đã sao chép!'))
      .catch(() => setCopySuccess('Sao chép thất bại.'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full mx-4">
        <div className="text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Đã tạo cuộc bình chọn thành công!</h1>
          <p className="text-gray-600 mb-4">Chia sẻ đường link này với mọi người để bắt đầu bình chọn:</p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6 break-all text-indigo-600 font-medium">
            {voteUrl}
          </div>
          <button
            onClick={copyLink}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:opacity-90 transition duration-200 font-semibold text-lg shadow-md w-full"
          >
            {copySuccess || 'Sao chép liên kết'}
          </button>
          {copySuccess && (
            <div className="mt-4 flex items-center justify-center text-green-500">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{copySuccess}</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
} 