import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [senderUsername, setSenderUsername] = useState('');
  const [receiverUsername, setReceiverUsername] = useState('');
  const [content, setContent] = useState('');
  const [socket, setSocket] = useState(null);  

  useEffect(() => {
    
    const ws = new WebSocket('ws://localhost:3000'); 

    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data); 
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
    };


    setSocket(ws);

   
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []); 

  const sendMessage = () => {
    if (!senderUsername || !receiverUsername || !content) {
      alert('Please fill in all fields');
      return;
    }


    const message = {
      senderUsername,
      receiverUsername,
      message: content,
    };

    
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));  
      setContent('');  
    } else {
      console.error('WebSocket is not open');
    }
  };
  
  return (
    <div className="App">
      <h1>Realtime Chat</h1>

      <div className="message-list">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className="message">
              <p><strong>{message.senderUsername}</strong>: {message.message}</p>
              <p><em>{message.timestamp}</em></p>
            </div>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </div>

      <div className="message-input">
        <input
          type="text"
          placeholder="Sender Username"
          value={senderUsername}
          onChange={(e) => setSenderUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Receiver Username"
          value={receiverUsername}
          onChange={(e) => setReceiverUsername(e.target.value)}
        />
        <textarea
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={sendMessage}>Send Message</button>
      </div>
    </div>
  );
}

export default App;
