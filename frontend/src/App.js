import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AIAssistantPlatform from "./components/AIAssistantPlatform";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AIAssistantPlatform />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;