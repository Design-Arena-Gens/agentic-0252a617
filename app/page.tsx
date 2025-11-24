'use client';

import { useState } from 'react';

interface Message {
  id: string;
  customer: string;
  message: string;
  timestamp: Date;
  replied: boolean;
  reply?: string;
}

const quickReplies = [
  "Hi! Yes, this item is still available. Would you like to know more about it?",
  "Thanks for your interest! When would you like to pick it up?",
  "The price is firm, but I can offer free delivery within 10 miles.",
  "Let me know if you have any questions about the item!",
  "Yes, I can hold it for you. How soon can you pick it up?",
  "The item is in excellent condition. Would you like to see more photos?",
  "I'm available to meet today or tomorrow. What works best for you?",
  "Thanks for reaching out! The item is exactly as described in the listing.",
];

const commonQuestions = [
  { q: "Is this still available?", a: "Yes, this item is still available!" },
  { q: "What's your lowest price?", a: "The price listed is my best offer, but I'm open to reasonable offers." },
  { q: "Can you deliver?", a: "Yes, I can deliver within a reasonable distance. Where are you located?" },
  { q: "What condition is it in?", a: "It's in excellent condition with minimal signs of use." },
  { q: "When can I pick it up?", a: "I'm flexible with pickup times. When works best for you?" },
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      customer: 'John Smith',
      message: 'Is this still available?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      replied: false,
    },
    {
      id: '2',
      customer: 'Sarah Johnson',
      message: "Hi, I'm interested in this item. Can you tell me more about its condition?",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      replied: false,
    },
    {
      id: '3',
      customer: 'Mike Wilson',
      message: "What's your lowest price? Can you deliver?",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      replied: true,
      reply: "The price is $50 firm. I can deliver within 10 miles for free.",
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newCustomer, setNewCustomer] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) return;

    setMessages(messages.map(msg =>
      msg.id === selectedMessage.id
        ? { ...msg, replied: true, reply: replyText }
        : msg
    ));

    setReplyText('');
    setSelectedMessage(null);
  };

  const handleQuickReply = (reply: string) => {
    setReplyText(reply);
  };

  const handleAddMessage = () => {
    if (!newCustomer.trim() || !newMessage.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      customer: newCustomer,
      message: newMessage,
      timestamp: new Date(),
      replied: false,
    };

    setMessages([newMsg, ...messages]);
    setNewCustomer('');
    setNewMessage('');
  };

  const unrepliedCount = messages.filter(m => !m.replied).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📱 Facebook Marketplace Messenger
          </h1>
          <p className="text-gray-600">
            Manage and reply to your customer messages
          </p>
          <div className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-full font-semibold">
            {unrepliedCount} {unrepliedCount === 1 ? 'message' : 'messages'} waiting
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Messages</h2>

            {/* Add New Message */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-sm text-gray-700">Simulate New Message</h3>
              <input
                type="text"
                placeholder="Customer name"
                value={newCustomer}
                onChange={(e) => setNewCustomer(e.target.value)}
                className="w-full p-2 border rounded mb-2 text-sm"
              />
              <textarea
                placeholder="Customer message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full p-2 border rounded mb-2 text-sm"
                rows={2}
              />
              <button
                onClick={handleAddMessage}
                className="w-full bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 text-sm"
              >
                Add Message
              </button>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 rounded-lg cursor-pointer transition ${
                    selectedMessage?.id === msg.id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : msg.replied
                      ? 'bg-green-50 hover:bg-green-100'
                      : 'bg-red-50 hover:bg-red-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{msg.customer}</h3>
                    {!msg.replied && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                    {msg.replied && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{msg.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Reply Panel */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            {selectedMessage ? (
              <>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Message from {selectedMessage.customer}
                  </h2>
                  <p className="text-gray-700">{selectedMessage.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Received: {selectedMessage.timestamp.toLocaleString()}
                  </p>
                  {selectedMessage.replied && (
                    <div className="mt-4 p-3 bg-green-100 rounded border-l-4 border-green-500">
                      <p className="font-semibold text-green-800 mb-1">Your Reply:</p>
                      <p className="text-gray-700">{selectedMessage.reply}</p>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-3 text-gray-800">Quick Replies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                  {quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickReply(reply)}
                      className="text-left p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-sm transition border border-indigo-200"
                    >
                      {reply}
                    </button>
                  ))}
                </div>

                <h3 className="text-lg font-semibold mb-3 text-gray-800">Common Q&A</h3>
                <div className="mb-6 space-y-2">
                  {commonQuestions.map((qa, idx) => (
                    <div key={idx} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="font-semibold text-gray-800 text-sm">Q: {qa.q}</p>
                      <p className="text-gray-700 text-sm mt-1">A: {qa.a}</p>
                      <button
                        onClick={() => handleQuickReply(qa.a)}
                        className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        Use this reply →
                      </button>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-semibold mb-3 text-gray-800">Your Reply</h3>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full p-4 border-2 border-gray-300 rounded-lg mb-4 min-h-[150px] focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                    replyText.trim()
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Send Reply
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-xl">Select a message to reply</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
