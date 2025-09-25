import React, { useState } from "react";
import { NavLink } from "react-router-dom";


const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  const linkBase =
    "text-[28px] font-normal tracking-wider transition-colors duration-300";
  const linkInactive = "text-white-100 hover:text-white hover:drop-shadow";
  const linkActive = "text-blue-400 drop-shadow";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 text-white bg-blue-500 backdrop-blur-md py-4 px-8">
      <div className="flex items-center justify-between">
        {/* Toggle (mobile) */}
        <button
          onClick={toggleMenu}
          className="xl:hidden text-2xl ml-auto text-[#2F5D89]"
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Links */}
        <ul
          className={[
            // mobile default hidden
            "hidden w-full flex-col pt-4 gap-4",
            // open on mobile
            isOpen ? "flex" : "",
            // desktop layout
            "xl:flex xl:w-auto xl:flex-row xl:items-center xl:gap-7 xl:pt-0",
          ].join(" ")}
        >
          <li className="flex items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                [linkBase, isActive ? linkActive : linkInactive].join(" ")
              }
            >
              Home
            </NavLink>
          </li>

          <span className="hidden xl:inline-block h-5 border-l border-[#6997C480]" />

          <li className="flex items-center">
            <NavLink
              to="/Chatbot"
              className={({ isActive }) =>
                [linkBase, isActive ? linkActive : linkInactive].join(" ")
              }
            >
              Ai Chatbot
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;