import React from "react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../Navbar/NavBar";
import AppRoutes from "./AppRoutes";

const RoutesProvider: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar/>  
     <AppRoutes/>
    </BrowserRouter>
  );
};

export default RoutesProvider;
