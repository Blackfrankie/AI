import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FlappyBirdGame from "./components/FlappyBirdGame";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FlappyBirdGame />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;