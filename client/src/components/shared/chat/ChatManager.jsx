import React from 'react';
import ChatPopup from './ChatPopup';

const ChatManager = ({
  activeChats,
  onCloseChat,
  onMinimizeChat,
  onMaximizeChat,
  onToggleMinimize
}) => {
  // Calculate positions for multiple minimized chats
  const getMinimizedPosition = (index) => {
    const baseRight = 16; // Base right offset
    const chatWidth = 320; // Width of minimized chat
    const spacing = 8; // Space between chats

    return {
      right: `${baseRight + (chatWidth + spacing) * index}px`
    };
  };

  const getMaximizedPosition = (index) => {
    const baseRight = 16;
    const chatWidth = 384; // Width of maximized chat
    const spacing = 16;

    return {
      right: `${baseRight + (chatWidth + spacing) * index}px`
    };
  };

  return (
    <>
      {activeChats.map((chat, index) => (
        <div
          key={chat.id}
          className={`fixed z-50 transition-all duration-300 ${
            chat.isMinimized ? 'bottom-4' : 'bottom-0 md:bottom-4'
          }`}
          style={
            chat.isMinimized
              ? getMinimizedPosition(index)
              : getMaximizedPosition(index)
          }
        >
          <ChatPopup
            isOpen={chat.isOpen}
            onClose={() => onCloseChat(chat.id)}
            seller={chat.seller}
            product={chat.product}
            isMinimized={chat.isMinimized}
            onToggleMinimize={() => onToggleMinimize(chat.id)}
            onMaximize={() => onMaximizeChat(chat.id)}
          />
        </div>
      ))}
    </>
  );
};

export default ChatManager;