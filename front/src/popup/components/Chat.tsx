import React from "react";
import Markdown from "markdown-to-jsx";
import Message from "../../types/Message.interface";

function Chat({ chatMessageArray }: { chatMessageArray: Message[] }) {
  return (
    <div className="h-90 flex flex-col px-4 overflow-y-scroll bg-transparent overflow-x-hidden w-full">
      {chatMessageArray.map((messageObject) => (
        <ChatMessage messageObject={messageObject} key={messageObject.id} />
      ))}
    </div>
  );
}

function ChatMessage({ messageObject }: { messageObject: Message }) {
  return (
    <div className="flex flex-col my-2">
      <div
        className={`flex ${
          messageObject.isRobot ? "" : "items-end justify-end"
        } flex-row max-w-full text-white`}
      >
        {messageObject.isRobot && (
          <img src="icon.png" alt="Your Assistant" className="w-12 h-12 mr-1 mt-1" />
        )}
        <div className="w-max max-w-[70%] bg-primary p-2 rounded-xl break-words">
          <Markdown
            options={{
              overrides: {
                a: {
                  props: {
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-blue-500 hover:underline",
                  },
                },
                strong: {
                  props: {
                    className: "font-bold",
                  },
                },
              },
            }}
          >
            {messageObject.message}
          </Markdown>
        </div>
      </div>
      <span
        className={`flex flex-row ${
          messageObject.isRobot ? "" : "items-end justify-end"
        } w-full mt-1`}
      >
        {messageObject.isRobot && <div className="w-10"></div>}
        <span className="text-white font-medium ml-5">
          {messageObject.timeString}
        </span>
        {!messageObject.isRobot && <div className="w-2"></div>}
      </span>
    </div>
  );
}

export default Chat;
