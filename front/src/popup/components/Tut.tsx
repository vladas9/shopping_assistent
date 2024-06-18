import React, { useState, useEffect } from "react";
import axios from "axios";
const Tut = () => {
  const [user, setUser] = useState({});
  console.log(user)

  useEffect(() => {
    axios.get("http://localhost:3000/auth/me")
    .then(res=>setUser(res.data))
    
  }, []);

  const handleLogin = () => {
    chrome.tabs.create({url:"http://localhost:3000/auth/google",active:true,selected:true})
  }
   
  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout').then(response=>window.location.reload())
  }
  

  return (
    <div className="h-screen">
        <div className="flex justify-center items-center py-44">
            {user?
            <button onClick={handleLogout} className="py-4 px-3 bg-red-500 text-white m-2">
                Logout
            </button>
            :
            <button onClick={handleLogin} className="py-4 px-3 bg-red-500 text-white m-2">
                Login with google
            </button>
            }
        </div>
    </div>
  );
};

export default Tut;
