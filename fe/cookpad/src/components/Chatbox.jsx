// src/components/Chatbox.jsx
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react'; // Dùng icon từ lucide-react cho đồng bộ
import { sendChatbotQuery } from '../services/chatbotApi';

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Xin chào! Tôi là trợ lý ảo PCook. Bạn muốn tìm công thức món gì hôm nay?',
      sender: 'bot',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessageText = inputValue.trim();
    setInputValue(''); // Xóa ô nhập liệu ngay lập tức

    // 1. Thêm tin nhắn của User vào danh sách
    const newUserMsg = {
      id: Date.now(),
      text: userMessageText,
      sender: 'user',
    };
    setMessages((prev) => [...prev, newUserMsg]);

    // 2. Gọi API
    setIsTyping(true);
    try {
      const response = await sendChatbotQuery(userMessageText);
      const botReply = response.data.reply || 'Xin lỗi, tôi không hiểu ý bạn.';

      // 3. Thêm tin nhắn của Bot vào danh sách
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: botReply,
          sender: 'bot',
        },
      ]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.',
          sender: 'bot',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Nút Mở Chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-cookpad-orange text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition-transform hover:scale-105"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Cửa sổ Chat */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 h-[500px] animate-fade-in-up">
          {/* Header */}
          <div className="bg-cookpad-orange p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot size={24} />
              <h3 className="font-bold">Trợ lý PCook</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm break-words ${
                    msg.sender === 'user'
                      ? 'bg-cookpad-orange text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-2 flex items-center gap-1 shadow-sm">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hỏi gì đó..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-cookpad-orange focus:ring-1 focus:ring-cookpad-orange transition-all"
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className={`p-2 rounded-full ${
                inputValue.trim() && !isTyping
                  ? 'bg-cookpad-orange text-white hover:bg-orange-600'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              } transition-colors`}
            >
              {isTyping ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
