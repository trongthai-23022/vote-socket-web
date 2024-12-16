"use client";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Pusher from "pusher-js";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

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

const ResultPage = ({ params }: { params: { slug: string } }) => {
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

  if (!voteData) {
    return <p>Loading...</p>;
  }

  const truncateLabel = (label: string, maxLength: number) => {
    return label.length > maxLength ? label.slice(0, maxLength) + '...' : label;
  };

  const chartData = {
    labels: voteData.options.map((option) => truncateLabel(option.option, 30)),
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
      <h1 className="text-4xl font-bold mb-4 text-indigo-900">
        Kết quả cuộc bình chọn
      </h1>
      <h1 className="text-4xl font-bold mb-6 text-indigo-600">
         {voteData.title}
      </h1>
      <div className="w-full max-w-lg">
        <Bar data={chartData} />
      </div>
      <div className="mt-8 space-y-2">
        {voteData.options.map((option) => (
          <div key={option.id} className="text-lg">
            {option.option}: <span className="font-bold">{option.votes}</span> phiếu
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultPage; 