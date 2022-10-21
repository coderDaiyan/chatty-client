import { useEffect, useState } from "react";
import addNotification from "react-push-notification";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("https://chatty-server-production.up.railway.app/");

function App() {
  const [msg, setMsg] = useState("");
  const [chats, setChats] = useState([]);

  const sendChat = (e) => {
    e.preventDefault();
    socket.emit("chat", { msg, user: socket.id });
    addNotification({
      title: "Success!",
      subtitle: "This is a subtitle",
      message: "Your message sent successfully :))",
      theme: "darkblue",
      native: true, // when using native, your OS will handle theming.
    });
    setMsg("");
  };

  useEffect(() => {
    socket.on("chat", (payload) => setChats([...chats, payload]));
  }, [chats]);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Chatty</h1>
        <div>
          {chats.map(({ msg: message, user }, index) => {
            return (
              <>
                <div
                  className={`${
                    socket.id === user ? "msg_body" : "other_msg_body"
                  }`}
                >
                  <p key={index}>{message}</p>
                  <span>ID: {user.substr(0, 5)}</span>
                </div>
              </>
            );
          })}
        </div>
        <form onSubmit={sendChat}>
          <input
            type="text"
            name="chat"
            placeholder="Write your message"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </header>
    </div>
  );
}

export default App;
