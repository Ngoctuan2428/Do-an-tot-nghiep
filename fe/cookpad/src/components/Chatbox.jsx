import { useState } from 'react';
import { IoChatboxOutline } from "react-icons/io5";

function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // --- CONTAINER CHÍNH ---
    // Nó sẽ thay đổi kích thước và vị trí dựa trên `isOpen` và kích thước màn hình
    <div className={`
      fixed z-50
      bottom-20 right-4 
      ${isOpen ? 'top-0 left-0 w-screen h-screen' : ''}
      md:top-auto md:left-auto md:bottom-5 md:right-5
      md:w-auto md:h-auto
    `}>
      
      {isOpen && (
        <div className="
          w-full h-full bg-white shadow-xl 
          flex flex-col 
          md:w-80 md:h-[500px] md:rounded-lg
        ">
          <div className="
            p-3 bg-blue-500 text-white 
            flex justify-between items-center
            md:rounded-t-lg
          ">
            <span className="font-bold">Hỗ trợ trực tuyến</span>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1 rounded-full hover:bg-blue-600"
              aria-label="Đóng chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto">
            <p>Xin chào! Tôi có thể giúp gì cho bạn?</p>
          </div>
          <div className="border-t p-2 flex">
            <input 
              type="text" 
              placeholder="Nhập tin nhắn..." 
              className="flex-1 border rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
            />
            <button className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600">
              Gửi
            </button>
          </div>
        </div>
      )}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="
            w-16 h-16 bg-blue-500 rounded-full text-white text-3xl 
            flex items-center justify-center shadow-lg
            hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400
          "
          aria-label="Mở chat"
        >
          <IoChatboxOutline size={24} />
        </button>
      )}
    </div>
  );
}

export default ChatBox;