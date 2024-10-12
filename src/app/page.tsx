"use client";

import { useState } from 'react';

const ChatBot = () => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai' }[]>([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages((prevMessages) => [...prevMessages, { text: input, sender: 'user' }]);

      try {
        const response = await fetch('/api/gemini-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }), // Mengirim input ke API
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setMessages((prevMessages) => [...prevMessages, { text: data.reply, sender: 'ai' }]);
      } catch (error) {
        console.error('Error fetching AI response:', error);
        setMessages((prevMessages) => [...prevMessages, { text: 'Error fetching response', sender: 'ai' }]);
      }

      setInput('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Chatbot Gemini AI</h1>
        <div className="h-64 overflow-y-auto mb-4 bg-gray-50 p-3 rounded-md">
          {messages.map((message, idx) => (
            <div key={idx} className={`flex justify-${message.sender === 'user' ? 'end' : 'start'} mb-2`}>
              <span
                className={`p-2 rounded-md ${message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 text-blue-800'
                  }`}
              >
                {message.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded-md"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            className="p-2 bg-blue-500 text-white rounded-md"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
