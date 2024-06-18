import React, { useEffect, useState } from "react";
import { FiLogOut, FiGithub } from 'react-icons/fi';
import axios from "axios";  
import "./header.css"; 

const Header = ({ user, setUser }) => {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/auth/me")
      .then(res => setUser(res.data))
      .catch(error => console.error("Error fetching user data:", error));
  }, [setUser]);

  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
      .then(response => window.location.reload())
      .catch(error => console.error("Error logging out:", error));
  };

  return (
    <div className="h-30 bg-custom-color m-2 p-2 rounded-md flex flex-col items-center mb-5">
      <div className="flex flex-row w-full justify-end">
        <div 
          className="text-xl text-better_white hover:text-white hover:cursor-pointer hover:scale-110 transition-all z-10 m-1" 
          onClick={handleLogout}
        >
          <FiLogOut/>
        </div>
        <a
          href="https://github.com/vvtttvv/Summer_Huckers"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl text-better_white hover:text-white hover:cursor-pointer hover:scale-110 transition-all z-10 m-1"
        >
          <FiGithub />
        </a>
      </div>
      <div 
        className={`flex flex-row w-full items-center justify-center mr-2 -mt-8 ${hovered ? 'hovered' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img 
          src="icon.png" 
          alt="" 
          className="w-14 h-14 spin-fast mt-3 mr-6"  
        />
        <div className="flex flex-col mt-3">
          <span className="text-3xl text-white text-center items-center justify-center font-light font-geologica">
            PedroBot
          </span>
          <span className="text-xl text-white text-center font-poiretone font-semibold">
            Made by Team 1
          </span>
        </div>
      </div>
      <div className="w-2/3 h-[2px] bg-white mt-4 mb-2"></div>
    </div>
  );
};

export default Header;
