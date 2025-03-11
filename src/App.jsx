import { Route, Routes } from "react-router-dom";
import "./App.css";
import PollView from "./components/PollView";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/poll/:id" element={<PollView />} />
    </Routes>
  );
}

export default App;
