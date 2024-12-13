"use client";
import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { useRouter } from "next/navigation";

interface Option {
  id: string;
  option: string;
  votes: number;
}

interface VoteData {
  id: string;
  title: string;
  options: Option[];
}

const VotePage = ({ params }: { params: { slug: string } }) => {
  const router = useRouter();
  const id = params.slug;
  const [voteData, setVoteData] = useState<VoteData | null>(null);

  useEffect(() => {
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
  }, [id]);

  const handleVote = async (index: number) => {
    if (!voteData) return;

    try {
      await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: voteData.options[index].id }),
      });
      router.push(`/vote/${id}/result`);
    } catch (error) {
      console.error("Failed to update vote:", error);
    }
  };

  if (!voteData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-extrabold mb-6 text-indigo-600">
        {voteData.title}
      </h1>
      <div className="grid grid-cols-1 gap-4 w-full max-w-lg">
        {voteData.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => handleVote(index)}
            className="bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-200 px-6 py-3 rounded-lg text-lg font-semibold"
          >
            {option.option}
          </button>
        ))}
      </div>
      <button
        onClick={() => router.push(`/vote/${id}/result`)}
        className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors duration-200"
      >
        Xem kết quả
      </button>
    </div>
  );
};

export default VotePage;
