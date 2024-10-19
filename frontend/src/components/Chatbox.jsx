import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Chatbox = ({ friend, conversationId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatMessagesRef = useRef(null); 

  useEffect(() => {
    const fetchMessages = async () => {
      console.log("Fetching all messages for conversationId:", conversationId);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:4000/api/conversations/getMessageHistory/${conversationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Fetched messages:", response.data);
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  useEffect(() => {
    const chatBox = chatMessagesRef.current;
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight; 
    }
  }, [messages]);

  // Sending a new message
  const handleSendMessage = async () => {
    console.log("Sending new message:", newMessage);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/conversations/sendMessage",
        { conversationId, message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Message sent successfully:", response.data);

      setMessages([...messages, response.data]); 
      setNewMessage(""); // Clear the input
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

      {/* Chat messages */}
      <div
        className="chat-messages h-48 overflow-y-auto bg-gray-900 p-2 rounded"
        ref={chatMessagesRef}  
      >
        {messages.map((msg, index) => {
          const isSender = msg.sender._id === localStorage.getItem("userId"); 
          return (
            <div key={index} className={`flex ${isSender ? "justify-end" : "justify-start"} mb-2`}>
              <p
                className={`text-sm p-2 rounded-lg ${isSender ? "bg-blue-500 text-white" : "bg-gray-600 text-white"} max-w-xs`}
              >
                <strong>{msg.sender.name}:</strong> {msg.message}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chat input section */}
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
