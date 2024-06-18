import React,{useEffect} from 'react'
import axios from "axios";

const Landing = ({setUser}) => {

  useEffect(() => {
    axios.get("http://localhost:3000/auth/me")
    .then(res=>setUser(res.data))
    
  }, []);


  const handleLogin = () => {
    chrome.tabs.create({url:"http://localhost:3000/auth/google",active:true,selected:true})
  }

   return (
    <div className=" bg-primary m-2 p-2 rounded-md h-[500px] items-center">
      <div className="flex flex-col w-full items-center justify-center mr-2">
        <img src="icon.png" alt="" className="w-20 h-20 animate-spin-slow mt-12 " />
        <div className="flex flex-col mt-3 items-center">
          <span className="text-4xl text-white ml-3 text-center items-center justify-center font-light font-geologica mt-8">
            BuyBot
          </span>
          <span className="text-2xl text-white  text-center font-poiretone font-semibold">
            Bu team 1
          </span>
          <span className='text-sm text-center font-urbanist w-9/12 mt-12 text-better_white'>
            Get possibility to buy efficiently!
          </span>
         <a
        onClick={handleLogin}
        className="rounded-md px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-white text-white mt-12"
      >
        <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-custom-color top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
        <span className="relative text-white transition duration-300 group-hover:text-primary ease flex flex-row align-middle">
          {/* <BiExtension className="mr-1 text-2xl" /> */}
          <p className="font-semibold text-base font-urbanist mt-0.5">
            Get Started
          </p>
        </span>
      </a>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default Landing