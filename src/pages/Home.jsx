import React from "react";
import CreatePoll from "../components/CreatePoll";

const Home = () => {
  return (
    <main className="bg-gray-100 p-6 min-h-screen container mx-auto">
      <div className="p-4 max-w-3xl mx-auto space-y-4 py-6 bg-white rounded shadow">
        <h1 className="text-3xl text-center text-purple-700">Vanish Vote</h1>
        <CreatePoll />
      </div>
    </main>
  );
};

export default Home;
