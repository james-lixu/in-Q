import React, { useEffect, useState } from "react";
import axios from "axios";
import EmptyIcon from "../images/Empty.png";
import { useNavigate } from "react-router-dom"; 

const ConversationList = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:4000/api/conversations/getUserConversations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setConversations(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };

    fetchConversations();
  }, []);

  if (loading) return <p>Loading conversations...</p>;

  return (
    <div className="conversation-list-container">
      {conversations.length === 0 ? (
        <div className="empty-conversations flex flex-col items-center">
          <img src={EmptyIcon} alt="No conversations" className="w-40 h-40" />
          <p>No conversations found.</p>
          <button
            onClick={() => navigate("/select-friend")} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Start New Conversation
          </button>
        </div>
      ) : (
        <div className="conversation-list">
          {conversations.map((conversation) => (
            <div
              key={conversation._id}
              onClick={() => onSelectConversation(conversation._id)}
              className="conversation-item cursor-pointer border-b border-gray-300 p-4"
            >
              <p>
                <strong>Participants:</strong>{" "}
                {conversation.participants.map((p) => p.name).join(", ")}
              </p>
              <p>
                <strong>Last Message:</strong>{" "}
                {conversation.lastMessage || "No messages yet"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationList;
