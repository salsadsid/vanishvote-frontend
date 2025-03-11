import axios from "axios";
import { useState } from "react";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [expiresIn, setExpiresIn] = useState(1);
  const [hideResults, setHideResults] = useState(false);
  const [pollLink, setPollLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(`${import.meta.env.VITE_API}/polls`, {
      question,
      options,
      expiresIn,
      hideResults,
    });
    console.log(data);
    setPollLink(`${window.location.origin}/poll/${data.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {pollLink ? (
        <div className="mt-4 p-4 bg-green-100 rounded">
          Share this link:{" "}
          <a href={pollLink} className="text-blue-600">
            {pollLink}
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Poll question"
            className="w-full p-2 border rounded"
            required
          />
          {options.map((opt, i) => (
            <input
              key={i}
              type="text"
              value={opt}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[i] = e.target.value;
                setOptions(newOptions);
              }}
              placeholder={`Option ${i + 1}`}
              className="w-full p-2 border rounded"
              required
            />
          ))}
          <button
            type="button"
            onClick={() => setOptions([...options, ""])}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Add Option
          </button>
          <select
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value={1}>1 Hour</option>
            <option value={12}>12 Hours</option>
            <option value={24}>24 Hours</option>
          </select>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={hideResults}
              onChange={(e) => setHideResults(e.target.checked)}
            />
            <span>Hide results until poll ends</span>
          </label>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Create Poll
          </button>
        </form>
      )}
    </div>
  );
}
