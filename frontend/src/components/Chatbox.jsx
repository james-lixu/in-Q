import React, { useState, useEffect } from "react";
import axios from "axios";

const Chatbox = ({ friend, conversationId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      console.log("Fetching messages for conversationId:", conversationId);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:4000/api/conversations/getMessageHistory/${conversationId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Fetched messages:", response.data);
        setMessages(response.data);  
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    if (conversationId) {
      fetchMessages();
    } else {
      console.warn("conversationId is undefined or invalid:", conversationId);
    }
  }, [conversationId]);

  const handleSendMessage = async () => {
    console.log("Sending new message:", newMessage);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        "http://localhost:4000/api/conversations/sendMessage",
        { conversationId, message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Message sent successfully:", response.data);
      setMessages([...messages, response.data]);  
      setNewMessage("");  
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="chat-box fixed bottom-0 right-0 w-72 bg-gray-800 text-white p-4 rounded-lg shadow-lg m-4">
      <div className="chat-header flex justify-between items-center border-b pb-2 mb-2">
        <h3 className="font-bold">{friend.name}</h3>
        <button onClick={onClose} className="text-red-500">Close</button>
      </div>
      <div className="chat-messages h-48 overflow-y-auto bg-gray-900 p-2 rounded">
        {messages.map((msg, index) => (
          <p key={index} className="text-sm">
            <strong>{msg.sender.name}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <div className="chat-input mt-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <button onClick={handleSendMessage} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
