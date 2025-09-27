import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../components/Home/Home";
import Aichatbot from "../components/Chatbot/Aichatbot";



const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/Chatbot" element={<Aichatbot/>}/>
    </Routes>
  );
};

export default AppRoutes;
