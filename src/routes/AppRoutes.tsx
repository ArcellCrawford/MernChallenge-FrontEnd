import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../components/Home/Home";
import Aichatbot from "../components/Chatbot/Aichatbot";
import StudentDetails from "../components/Studentdetails/Student_details";


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/Chatbot" element={<Aichatbot/>}/>
      <Route path="/Student Details" element={<StudentDetails/>}/>
    </Routes>
  );
};

export default AppRoutes;
