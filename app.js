import React, { useState, useEffect } from "react";

const App = () => {
  const [ws, setWs] = useState(null);
  const [assistantText, setAssistantText] = useState("");
  
  useEffect(() => {
    const websocket = new WebSocket("wss://your-backend.onrender.com/ws");
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setAssistantText(data.text);

      // play audio
      const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
      audio.play();
    };
    setWs(websocket);
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => {
      if (ws.readyState === WebSocket.OPEN) {
        const reader = new FileReader();
        reader.onload = () => {
          const b64 = reader.result.split(",")[1];
          ws.send(b64);
        };
        reader.readAsDataURL(e.data);
      }
    };
    mediaRecorder.start(1000); // send every 1s
  };

  return (
    <div>
      <h1>AnnaData Voice Assistant</h1>
      <button onClick={startRecording}>🎙️ Start Talking</button>
      <p>Assistant: {assistantText}</p>
    </div>
  );
};

export default App;
