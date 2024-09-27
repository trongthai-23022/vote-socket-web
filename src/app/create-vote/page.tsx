"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "../store/user";
import axios from "axios";

const CreateVote = () => {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const router = useRouter();
  const name = useUserStore((state) => state.name);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(JSON.stringify({ title, options }));

    try {
      const res = await axios.post(
        "/create-vote",
        {
          title,
          options,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data;
      console.log(data);

      if (data.voteId) {
        router.push(`/vote/${data.voteId}`);
      }
      console.log(data);
    } catch (error) {
      console.error("Failed to create vote", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4 ring-teal-500">
        Hi {name}, Create a New Vote
      </h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded w-full text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {options.map((option, index) => (
          <div key={index}>
            <label className="block mb-2">Option {index + 1}</label>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full text-black"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
          </div>
        ))}

        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddOption}
        >
          Add Option
        </button>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create Vote
        </button>
      </form>
    </div>
  );
};

export default CreateVote;
