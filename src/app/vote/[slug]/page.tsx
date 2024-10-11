"use client";
import { useState, useEffect } from "react";
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
import path from "path";

// Đăng ký các thành phần cần thiết của Chart.js
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
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      const newSocket = io("/api/socket", {
        path: "/api/socket", // Đường dẫn cho socket.io
      });

      newSocket.on("updateVote", (updatedVoteData) => {
        setVoteData(updatedVoteData);
      });

      setSocket(newSocket);
    };
    fetchVoteData(id);
    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [id]);

  //Render the vote page when the vote data is updateVote socket event

  const fetchVoteData = async (voteId: string) => {
    try {
      const res = await fetch(`/api/get-vote?id=${voteId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch vote data");
      }
      const data: VoteData = await res.json();
      setVoteData(data);
      console.log("Vote data", data);
    } catch (error) {
      console.error("Failed to fetch vote data", error);
    }
  };

  const handleVote = async (index: number) => {
    if (!voteData) return;

    const updatedOptions = voteData.options.map((option, i) => {
      return i === index ? { ...option, votes: option.votes + 1 } : option;
    });

    const updatedVoteData = { ...voteData, options: updatedOptions };

    // Update vote data on the server
    const optionId = voteData.options[index].id;
    try {
      await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ optionId }),
      });

      if (socket && socket.emit) {
        socket.emit("vote", updatedVoteData);
      } else {
        console.error(
          "Socket is not initialized or emit method is not available"
        );
      }
    } catch (error) {
      console.error("Failed to update vote data", error);
    }
  };

  if (!voteData) {
    return <p>Loading...</p>;
  }

  const data = {
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
      <h1 className="text-4xl font-extrabold mb-6 text-indigo-600 ring-offset-indigo-700 ">
        {voteData.title}
      </h1>
      <div className="w-full max-w-lg">
        <Bar data={data} />
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
