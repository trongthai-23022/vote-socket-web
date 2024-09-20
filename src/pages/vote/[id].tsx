import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";

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

let socket: Socket;

const VotePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [voteData, setVoteData] = useState<VoteData | null>(null);

  useEffect(() => {
    if (id) {
      fetchVoteData(id as string);
      socketInitializer();
    }

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
      const data = await res.json();
      setVoteData(data);
    } catch (error) {
      console.error("Failed to fetch vote data", error);
    }
  };

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("updateVote", (updatedVoteData: VoteData) => {
      console.log("Received updated vote data", updatedVoteData);
      if (updatedVoteData.id == id) {
        setVoteData(updatedVoteData);
      }
    });
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

      socket.emit("vote", updatedVoteData, (response: { status: string }) => {
        if (response.status === "ok") {
          console.log("Vote emitted successfully");
        } else {
          console.error("Failed to emit vote");
        }
      });
    } catch (error) {
      console.error("Failed to update vote data", error);
    }
  };

  if (!voteData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4 ring-offset-indigo-700">
        {voteData.title}
      </h1>
      <div className="flex space-x-4">
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
