import React, { useState, useEffect } from "react";
import { Stomp } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import MonacoEditor from "@monaco-editor/react";

const App = () => {
  const [code, setCode] = useState("// Start coding...");
  const [stompClient, setStompClient] = useState(null);
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!name) return; // Don't connect until name is set

    const socket = new SockJS("http://localhost:8080/ws");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe("/topic/updates", (message) => {
        setCode(message.body); // Update code for all users
      });

      client.subscribe("/topic/users", (message) => {
        setUsers(JSON.parse(message.body)); // Update active users
      });

      client.send("/app/join", {}, JSON.stringify({ name }));
    });

    setStompClient(client);

    return () => {
      if (client.connected) {
        client.send("/app/leave", {}, JSON.stringify({ name }));
        client.disconnect();
      }
    };
  }, [name]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (stompClient && stompClient.connected) {
      stompClient.send("/app/code", {}, newCode);
    }
  };

  return (
    <div style={{ height: "100vh", padding: "10px" }}>
      {!name ? (
        <div>
          <h2>Enter Your Name</h2>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={() => setName(name.trim())} disabled={!name.trim()}>
            Join
          </button>
        </div>
      ) : (
        <div>
          <h2>Collaborative Code Editor</h2>
          <p>Editing as: <strong>{name}</strong></p>
          <p>Active Users: {users.join(", ")}</p>
          <MonacoEditor
            height="80vh"
            language="java"
            theme="vs-dark"
            value={code}
            onChange={handleCodeChange}
          />
        </div>
      )}
    </div>
  );
};

export default App;
