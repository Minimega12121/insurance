import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<{ user: boolean; text: string }[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() !== "") {
      const newMessages = [
        ...messages, 
        { user: true, text: input },
        { user: false, text: "Thank you for reaching out! How can I assist you today?" }
      ];
      setMessages(newMessages);
      setInput("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="h-[400px] overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.user ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`
                max-w-[70%] px-4 py-2 rounded-2xl
                ${msg.user 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-100 text-gray-800"}
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex p-4 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-grow p-3 border rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
        />
        <button 
          onClick={sendMessage} 
          className="bg-blue-600 text-white px-5 py-3 rounded-r-xl hover:bg-blue-700 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;