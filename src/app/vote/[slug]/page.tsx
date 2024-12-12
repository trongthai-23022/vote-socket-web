"use client";
import { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import io, { Socket } from "socket.io-client";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Pusher from "pusher-js";

// Register necessary components of Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  const id = params.slug;
  const [voteData, setVoteData] = useState<VoteData | null>(null);

  useEffect(() => {
    console.log('Khởi tạo Pusher với key:', process.env.NEXT_PUBLIC_PUSHER_KEY);
    console.log('Cluster:', process.env.NEXT_PUBLIC_PUSHER_CLUSTER);

    // Khởi tạo Pusher client
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    });

    // Subscribe vào channel
    const channel = pusher.subscribe('voting-channel');
    console.log('Đã subscribe vào channel: voting-channel');
    
    // Lắng nghe sự kiện vote-updated
    channel.bind('vote-updated', (data: any) => {
      console.log('Nhận được sự kiện vote-updated:', data);
      // Fetch lại dữ liệu mới nhất khi có cập nhật
      fetchVoteData();
    });

    // Fetch dữ liệu ban đầu
    const fetchVoteData = async () => {
      console.log('Đang fetch dữ liệu ban đầu cho id:', id);
      try {
        const res = await fetch(`/api/get-vote?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch vote data");
        const data = await res.json();
        console.log('Dữ liệu ban đầu:', data);
        setVoteData(data);
      } catch (error) {
        console.error("Failed to fetch vote data:", error);
      }
    };

    fetchVoteData();

    // Cleanup
    return () => {
      console.log('Cleanup: Hủy đăng ký channel');
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [id]);

  const handleVote = async (index: number) => {
    if (!voteData) return;
    console.log('Xử lý vote cho option index:', index);

    try {
      console.log('Gửi request vote với optionId:', voteData.options[index].id);
      await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: voteData.options[index].id }),
      });
      console.log('Vote thành công');
    } catch (error) {
      console.error("Failed to update vote:", error);
    }
  };

  if (!voteData) {
    console.log('Đang loading dữ liệu...');
    return <p>Loading...</p>;
  }

  console.log('Chuẩn bị render chart với dữ liệu:', voteData);
  const chartData = {
    labels: voteData.options.map((option) => option.option),
    datasets: [
      {
        label: "Votes",
        data: voteData.options.map((option) => option.votes),
        backgroundColor: voteData.options.map((_, index) => {
          const colors = [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
          ];
          return colors[index % colors.length];
        }),
        borderRadius: 10,
        borderWidth: 2,
        borderColor: voteData.options.map((_, index) => {
          const borderColors = [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ];
          return borderColors[index % borderColors.length];
        }),
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-extrabold mb-6 text-indigo-600 ring-offset-indigo-700">
        {voteData.title}
      </h1>
      <div className="w-full max-w-lg">
        <Bar data={chartData} />
      </div>
      <div className="flex space-x-4 mt-4">
        {voteData.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => handleVote(index)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {option.option} ({option.votes} votes)
          </button>
        ))}
      </div>
    </div>
  );
};

export default VotePage;
