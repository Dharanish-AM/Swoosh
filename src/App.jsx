import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sender from "./components/Sender";
import { useEffect } from "react";

function App() {
  return (
    <div className="min-h-screen min-w-screen bg-[#EBFDF6] ">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/send" element={<Sender />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
