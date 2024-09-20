import { useState } from "react";
import { useRouter } from "next/router";

const CreateVote = () => {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const router = useRouter();

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
    const res = await fetch("/api/create-vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, options }),
    });

    const data = await res.json();
    if (data.id) {
      router.push(`/vote/${data.id}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4 ring-teal-500">
        Create a New Vote
      </h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded w-full"
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
              className="border border-gray-300 p-2 rounded w-full"
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
