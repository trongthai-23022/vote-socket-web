"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import useUserStore from '@/app/store/user';
import { VoteData } from "@/types";

const VotePage = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();
  const id = params.slug;
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [copySuccess, setCopySuccess] = useState('');
  const userName = useUserStore(state => state.name);
  const [isVoted, setIsVoted] = useState(false);
  console.log(id);
  useEffect(() => {
    if (!userName) {
      router.push(`/login?redirect=/vote/${id}`);
      return;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    });

    const channel = pusher.subscribe('voting-channel');
    
    channel.bind('vote-updated', (data: any) => {
      fetchVoteData();
    });

    const fetchVoteData = async () => {
      try {
        const res = await fetch(`/api/get-vote?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch vote data");
        const data = await res.json();
        setVoteData(data);
      } catch (error) {
        console.error("Failed to fetch vote data:", error);
      }
    };

    fetchVoteData();

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [id, userName, router]);

  const handleVote = async (index: number) => {
    if (!voteData || isVoted) return;

    try {
      setIsVoted(true);
      await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          optionId: voteData.options[index].id,
          voterName: userName
        }),
      });
      
      router.push(`/vote/${id}/result`);
    } catch (error) {
      console.error("Failed to update vote:", error);
    }finally{
      setIsVoted(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => setCopySuccess('Đã sao chép!'))
      .catch(() => setCopySuccess('Sao chép thất bại.'));
  };

  if (!voteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-8 animate-fadeIn">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          {userName && (
            <div className="mb-6 text-center">
              <div className="inline-flex items-center bg-indigo-100 px-4 py-2 rounded-full">
                <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-indigo-700 font-medium">Chào mừng, {userName}!</span>
              </div>
            </div>
          )}
          
          <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
            {voteData.title}
          </h1>

          <div className="space-y-4">
            {voteData.options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleVote(index)}
                className="w-full bg-white border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white transition-all duration-200 px-6 py-4 rounded-lg text-lg font-semibold flex items-center justify-between group"
              >
                <span>{option.option}</span>
                <svg 
                  className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push(`/vote/${id}/result`)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors duration-200 font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Xem kết quả
            </button>
            
            <button 
              onClick={copyLink} 
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              {copySuccess || 'Sao chép liên kết'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotePage;
