import React, { useState, useEffect } from "react";

function App() {
  const [chat, setChat] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(`${process.env.REACT_APP_BACKEND_URL}/ws`);

    socket.onopen = () => console.log("Connected to backend");
    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.text) {
        setChat((prev) => [...prev, { role: "assistant", content: data.text }]);
      }
      if (data.audioBase64) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
        audio.play();
      }
    };

    setWs(socket);
    return () => socket.close();
  }, []);

  const startMic = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = (e) => {
      const audioData = e.inputBuffer.getChannelData(0);
      const buffer = new ArrayBuffer(audioData.length * 2);
      const view = new DataView(buffer);
      let offset = 0;
      for (let i = 0; i < audioData.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, audioData[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      }
      ws.send(buffer);
    };
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🧑‍🌾 AnnaData Voice Assistant</h1>
      <button onClick={startMic}>🎙️ Start Talking</button>

      <div style={{ marginTop: "20px" }}>
        {chat.map((c, i) => (
          <p key={i}><b>{c.role}:</b> {c.content}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
