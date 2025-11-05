import { useState, useCallback } from 'react';

export const useChat = () => {
  const [activeChats, setActiveChats] = useState([]);

  const openChat = useCallback((seller, product) => {
    const chatId = `${seller.id}-${product.id}`;
    
    setActiveChats(prev => {
      const existingChat = prev.find(chat => chat.id === chatId);
      if (existingChat) {
        return prev.map(chat => 
          chat.id === chatId 
            ? { ...chat, isMinimized: false, isOpen: true }
            : chat
        );
      }
      
      const newChat = {
        id: chatId,
        seller,
        product,
        isOpen: true,
        isMinimized: false
      };
      
      return [...prev, newChat];
    });
  }, []);

  const closeChat = useCallback((chatId) => {
    setActiveChats(prev => prev.filter(chat => chat.id !== chatId));
  }, []);

  const minimizeChat = useCallback((chatId) => {
    setActiveChats(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, isMinimized: true }
          : chat
      )
    );
  }, []);

  const maximizeChat = useCallback((chatId) => {
    setActiveChats(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, isMinimized: false }
          : chat
      )
    );
  }, []);

  const toggleMinimize = useCallback((chatId) => {
    setActiveChats(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, isMinimized: !chat.isMinimized }
          : chat
      )
    );
  }, []);

  return {
    activeChats,
    openChat,
    closeChat,
    minimizeChat,
    maximizeChat,
    toggleMinimize
  };
};