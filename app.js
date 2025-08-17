import React, { useState } from "react";

function App() {
  const [chat, setChat] = useState([]);
  const [listening, setListening] = useState(false);

  const startListening = async () => {
    setListening(true);

    const recognition = new window.SpeechRecognition();
    recognition.lang = "hi-IN"; // Hindi
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const userText = event.results[0][0].transcript;
      setChat((prev) => [...prev, { role: "user", content: userText }]);

      // Here you will send userText to backend later
      // For now, simulate assistant response
      setTimeout(() => {
        const assistantText = `आपने कहा: ${userText}`;
        setChat((prev) => [...prev, { role: "assistant", content: assistantText }]);
      }, 1000);
    };

    recognition.onend = () => setListening(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🧑‍🌾 AnnaData Voice Assistant</h1>

      <button 
        onClick={startListening} 
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        {listening ? "Listening..." : "🎙️ Speak"}
      </button>

      <div style={{ marginTop: "20px" }}>
        {chat.map((c, i) => (
          <p key={i} style={{ 
              background: c.role === "user" ? "#D1F2EB" : "#FADBD8", 
              padding: "10px", borderRadius: "8px",
              maxWidth: "70%", margin: "5px 0"
            }}>
            <b>{c.role === "user" ? "You" : "Assistant"}:</b> {c.content}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
