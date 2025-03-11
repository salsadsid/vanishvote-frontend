import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PollView() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/polls/${id}`
        );
        setPoll(data);
        calculateTimeLeft(data.expiresAt);
      } catch (error) {
        console.error("Error fetching poll:", error);
      }
    };
    fetchPoll();
  }, [id]);

  const calculateTimeLeft = (expiration) => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = new Date(expiration) - now;

      if (distance < 0) {
        setTimeLeft("EXPIRED");
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m remaining`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    return () => clearInterval(timer);
  };

  const handleVote = async () => {
    if (selectedOption === null || hasVoted) return;

    try {
      await axios.post(`http://localhost:3000/api/polls/${id}/vote`, {
        optionIndex: selectedOption,
      });

      // Update local state
      const updatedPoll = { ...poll };
      updatedPoll.options[selectedOption].votes += 1;
      setPoll(updatedPoll);
      setHasVoted(true);
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  const handleReaction = async (type) => {
    try {
      await axios.patch(`http://localhost:3000/api/polls/${id}/reaction`, {
        type,
      });
      setPoll((prev) => ({
        ...prev,
        reactions: { ...prev.reactions, [type]: prev.reactions[type] + 1 },
      }));
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  if (!poll) return <div className="text-center p-8">Loading...</div>;
  if (timeLeft === "EXPIRED")
    return <div className="text-center p-8">This poll has expired</div>;

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0
  );
  const showResults = !poll.hideResults || timeLeft === "EXPIRED";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{poll.question}</h1>
        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
          {timeLeft}
        </span>
      </div>

      <div className="space-y-4 mb-8">
        {poll.options.map((option, index) => (
          <div key={index} className="border rounded-lg p-4">
            <button
              onClick={() => !hasVoted && setSelectedOption(index)}
              className={`w-full text-left ${
                !hasVoted ? "hover:bg-gray-50" : ""
              } 
                ${
                  selectedOption === index ? "bg-blue-50 border-blue-300" : ""
                }`}
              disabled={hasVoted}
            >
              {option.text}
              {showResults && (
                <div className="mt-2">
                  <div className="h-2 bg-gray-200 rounded">
                    <div
                      className="h-full bg-blue-500 rounded"
                      style={{
                        width: `${(option.votes / (totalVotes || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {option.votes} votes (
                    {Math.round((option.votes / (totalVotes || 1)) * 100)}%)
                  </span>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      {!hasVoted && (
        <button
          onClick={handleVote}
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
          disabled={selectedOption === null}
        >
          Submit Vote
        </button>
      )}

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => handleReaction("like")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg"
        >
          👍 {poll.reactions.like}
        </button>
        <button
          onClick={() => handleReaction("fire")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg"
        >
          🔥 {poll.reactions.fire}
        </button>
      </div>

      {/* Bonus: Comments Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <div className="space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Add anonymous comment..."
          />
          <button className="bg-gray-100 px-4 py-2 rounded">
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
}
