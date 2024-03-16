import { useState } from "react";

export default function ChatWindow({
  socket,
  messages,
  addMessage,
}: {
  socket: any;
  messages: any[];
  addMessage: (a: any) => void;
}) {
  const [text, setText] = useState("");

  function sendHandler(e: React.KeyboardEvent<HTMLInputElement>) {
    const msg = text.trim();
    if (!msg) return;

    if (e.key === "Enter") {
      console.log("send");
      sendMsg(msg);
      setText("");
    }
  }

  function sendMsg(msg: string) {
    socket.emit("message", msg);
  }

  return (
    <div className="bg-white absolute bottom-0 left-0 rounded-xl h-64 flex flex-col w-96 border m-2 shadow-lg">
      <div className="">
        <p className="p-2 border-b pl-3 text-slate-500 font-semibold">
          Online chat
        </p>
      </div>
      <div className="m-2 overflow-auto flex-grow" id="message-area">
        {messages.map((msg) => (
          <MessateItem id={msg.id} text={msg.text} time={msg.time} />
        ))}
      </div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={sendHandler}
        placeholder="Type your message here..."
        className="border-2 border-solid border-gray-200 rounded-xl p-2 m-0.5"
        type="text"
      ></input>
    </div>
  );
}

function MessateItem({
  id,
  text,
  time,
}: {
  id: string;
  text: string;
  time: string;
}) {
  return (
    <>
      <p className=" text-slate-500 text-xs">{id}</p>
      <div className="border rounded">
        <p>{text}</p>
      </div>
    </>
  );
}
