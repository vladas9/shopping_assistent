import React, { useRef, useState, useEffect } from "react";
import { VscSend } from "react-icons/vsc";
import TypeBoxProps from "../../types/TypeBoxProps.interface";

function generateTimestamp(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TypeBox({ chatMessageArray, setChatMessageArray, sendJsonMessage, typeRef }: TypeBoxProps) {
  const message = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      console.log("sending to backend ", msg);
      sendJsonMessage({
        type: "definition",
        // data: {
          content: msg
          //content: "Hardcoded stuff"
        // }
      });
    })
  }, [])


  const handleDefineClick = () => {
    console.log("clicked define");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "selection" });
    });
  }

  const current = new Date();

  const handleSuggestionClick = () => {
    chrome.storage.local.get("scrapeData")
      .then(scrapeObj => {
        console.log(scrapeObj)
        if(Object.values(scrapeObj).length < 1) {
          sendJsonMessage({
            type: "suggestion",
            data: {
              ...scrapeObj.scrapeData,
              content: message.current.value
              //content: "Hardcoded stuff"
            }
          });
          setChatMessageArray([
            ...chatMessageArray,
            {
              id: chatMessageArray[chatMessageArray.length - 1].id + 1,
              message: message.current.value,
              isRobot: false,
              timeString: generateTimestamp(current),
            },
            {
              id: chatMessageArray[chatMessageArray.length - 1].id + 2,
              message:  "Failed to retrieve data from webpage!",
              isRobot: true,
              timeString: generateTimestamp(current),
            }]);
        } else {
          sendJsonMessage({
            type: "suggestion",
            data: {
              ...scrapeObj.scrapeData,
              content: message.current.value
              //content: "Hardcoded stuff"
            }
          });
          setChatMessageArray([
            ...chatMessageArray,
            {
              id: chatMessageArray[chatMessageArray.length - 1].id + 1,
              message: message.current.value,
              isRobot: false,
              timeString: generateTimestamp(current),
            },
            {
              id: chatMessageArray[chatMessageArray.length - 1].id + 2,
              message:  "...",
              isRobot: true,
              timeString: generateTimestamp(current),
            }
          ]);
          message.current.value = " ";
          message.current.focus();
      }
    });
  }

  const handleInfoClick = () => {
    console.log("info click");
    chrome.storage.local.get("scrapeData")
      .then(scrapeObj => {
        console.log(scrapeObj)
        if(Object.values(scrapeObj).length < 1) {
          sendJsonMessage({
            type: "review",
            data: {
              ...scrapeObj.scrapeData,
              //content: "Hardcoded stuff"
            }
          });
          setChatMessageArray([
            ...chatMessageArray,
            {
              id: chatMessageArray[chatMessageArray.length - 1].id + 1,
              message: "Send info!",
              isRobot: false,
              timeString: generateTimestamp(current),
            },
            {
              id: chatMessageArray[chatMessageArray.length - 1].id + 2,
              message:  "Failed to retrieve data from webpage!",
              isRobot: true,
              timeString: generateTimestamp(current),
            }]);
        } else {
          sendJsonMessage({
            type: "review",
            data: {
              ...scrapeObj.scrapeData,
              //content: "Hardcoded stuff"
            }
          });
          setChatMessageArray([
            ...chatMessageArray,
            {
              id: chatMessageArray[chatMessageArray.length - 1].id + 1,
              message: "Send info please :3",
              isRobot: false,
              timeString: generateTimestamp(current),
            },
            {
              id: chatMessageArray[chatMessageArray.length - 1].id + 2,
              message:  "...",
              isRobot: true,
              timeString: generateTimestamp(current),
            }
          ]);
      }
    });
  }

  const handleAnalysisClick = () => {
    chrome.storage.local.get("scrapeData")
          .then(scrapeObj => {
            console.log("scrapeObj", scrapeObj)
            if(Object.values(scrapeObj).length < 1) {
              sendJsonMessage({
                type: typeRef.current,
                data: {
                  content: JSON.stringify(scrapeObj.scrapeData)
                  //content: "Hardcoded stuff"
                }
              });
            } else {
                sendJsonMessage({
                    type: 'analysis',
                    data: {
                      ...scrapeObj.scrapeData,
                      content: message.current.value
                      //content: JSON.stringify(scrapeObj.scrapeData)
                      //content: "Hardcoded stuff"
                    }
                });
                }
                message.current.value = " ";
                message.current.focus();
            })
  }

  const handleSendClick = () => {
    chrome.storage.local.get("scrapeData")
          .then(scrapeObj => {
            console.log("scrapeObj", scrapeObj)
            if(Object.values(scrapeObj).length < 1) {
              sendJsonMessage({
                type: "text",
                data: {
                  content: JSON.stringify(scrapeObj.scrapeData)
                  //content: "Hardcoded stuff"
                }
              });
              setChatMessageArray([
                ...chatMessageArray,
                {
                  id: chatMessageArray[chatMessageArray.length - 1].id + 1,
                  message: message.current.value,
                  isRobot: false,
                  timeString: generateTimestamp(current),
                },
                {
                  id: chatMessageArray[chatMessageArray.length - 1].id + 2,
                  message:  "Failed to retrieve data from webpage!",
                  isRobot: true,
                  timeString: generateTimestamp(current),
                }]);
            } else {
                sendJsonMessage({
                    type: 'text',
                    content: message.current.value,
                    data: {
                      ...scrapeObj.scrapeData,
                      
                      //content: JSON.stringify(scrapeObj.scrapeData)
                      //content: "Hardcoded stuff"
                    }
                });
                setChatMessageArray([
                  ...chatMessageArray,
                  {
                    id: chatMessageArray[chatMessageArray.length - 1].id + 1,
                    message: message.current.value,
                    isRobot: false,
                    timeString: generateTimestamp(current),
                  },
                  {
                    id: chatMessageArray[chatMessageArray.length - 1].id + 2,
                    message: "...",
                    isRobot: true,
                    timeString: generateTimestamp(current),
                  }]);
                }
                message.current.value = " ";
                message.current.focus();
            })
  }

  const handleFocus = () => {
    setIsFocused(true);
  };
  return (
    <div className="h-30 mt-200px pt-10">
      <div className="flex justify-center mb-2">
      <div className="space-x-2">
        <button 
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          onClick={() => handleInfoClick()}>
          Review
        </button>
        <button 
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          onClick={() => handleSuggestionClick()}>
          Suggestion
        </button>
        <button className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        onClick={() => handleAnalysisClick()}>
          Analyse Table
        </button>
        <button className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        onClick={() => handleDefineClick()}>
          Define
        </button>
      </div>
      </div>

    <div className={`h-20 p-2 pr-5 flex flex-row space-x-4 m-2 rounded-lg`} style={{ backgroundColor: isFocused ? '#221f1f' : '#100f0f' }}>
      <textarea
          name="message"
          id="message"
          className="w-full h-full resize-none text-white rounded-lg p-3 font-poppins outline-none scroll-teal"
          placeholder="Write Your Message"
          ref={message}
          onFocus={handleFocus}
          // onBlur={handleBlur}
          style={{ backgroundColor: 'transparent' }}
        ></textarea>
        <button
          className="text-white text-2xl hover:scale-110 transition-all"
          onClick={() => {
            if(message.current.value.length < 1) return;

            handleSendClick();
          }}
        >
          <VscSend />
        </button>
      </div>
    </div>
    
  );
}

export default TypeBox;
