import { useState, useEffect, useRef } from "react";
import React from "react";
import { Header, Chat, TypeBox,Tut,Landing } from "./components";
import "./popup.css";
import axios from "axios";
import Message from "../types/Message.interface";
import useWebSocket from "react-use-websocket";

function generateTimestamp(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function appendLastMessage(msgArray: Message[], newContent: string) {
  const lastElement = msgArray.pop();
  if(lastElement.message === "...") {
    console.log("changing three dots")
    lastElement.message = newContent;
  } else {
    console.log("appending new element");
    lastElement.message += ` ${newContent}`;
  }
  msgArray.push(lastElement);
  console.log(msgArray);

  return msgArray;
}

const WS_URL = "ws://192.168.8.76:8000";
const current = new Date();
function Popup() {
  const { lastJsonMessage, sendJsonMessage } = useWebSocket<any>(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    }
  });
  const typeRef = useRef<string | null>(null);
  

  useEffect(() => {
    // if(typeRef.current == null) return;

    // if(lastJsonMessage?.type == "analysis") {
    //   handleAnalysis(lastJsonMessage);
    // }

    console.log(lastJsonMessage)
    if(lastJsonMessage?.type == "analysis") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, lastJsonMessage);
      });
    } else if(lastJsonMessage?.type == "review") {
      console.log("review message: ");
      console.log(lastJsonMessage);
      setChatMessageArray(appendLastMessage(chatMessageArray, lastJsonMessage.review));
      setUser({});
    } else if(lastJsonMessage?.type == "suggestion") {
      console.log("suggestion message: ");
      console.log(lastJsonMessage);

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, lastJsonMessage);
      });
      
      setChatMessageArray(appendLastMessage(chatMessageArray, lastJsonMessage.suggestion));
      setUser({});
    } else if(lastJsonMessage?.type == 'definition') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, lastJsonMessage);
      });
    } else if (lastJsonMessage?.type == "text") {
      setChatMessageArray(appendLastMessage(chatMessageArray, lastJsonMessage.content));
      setUser({});
    } else {
      console.log("lastJsonMessage not defined");
    }
    
  }, [lastJsonMessage])

  const [user, setUser] = useState({});

  // useEffect(() => {
  //   axios.get("http://localhost:3000/auth/me")
  //   .then(res=>setUser(res.data))
    
  // }, []);

  //this array should be stored in useState and pulled from the database of every user
  const [chatMessageArray, setChatMessageArray] = useState<Message[]>([
    {
      id: 0,
      message: "Hi, my name is PedroBot and I am here to help you with shopping! ",
      isRobot: true,
      timeString: generateTimestamp(current),
    },
  ]);
  return (
    
<div className="flex flex-col w-[400px] h-max font-poppins" style={{
  backgroundColor: '#242424', 
}}>
      {user?
            <>
              <Header user={user} setUser={setUser}/>
              <Chat chatMessageArray={chatMessageArray} />
              <TypeBox
                chatMessageArray={chatMessageArray}
                setChatMessageArray={setChatMessageArray}
                sendJsonMessage={sendJsonMessage}
                typeRef={typeRef}
              />
            </>
            :
              <Landing setUser={setUser}/>
      }
    </div>
  );
}

export default Popup;
