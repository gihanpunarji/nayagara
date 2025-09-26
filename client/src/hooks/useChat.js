import { useState, useCallback } from 'react';

const useChat = () => {
  const [activeChats, setActiveChats] = useState(new Map());

  const openChat = useCallback((sellerId, sellerData, productData) => {
    const chatKey = `${sellerId}-${productData.id}`;

    setActiveChats(prev => {
      const newChats = new Map(prev);
      newChats.set(chatKey, {
        id: chatKey,
        sellerId,
        seller: sellerData,
        product: productData,
        isOpen: true,
        isMinimized: false,
        unreadCount: 0,
        lastActivity: new Date().toISOString()
      });
      return newChats;
    });

    return chatKey;
  }, []);

  const closeChat = useCallback((chatId) => {
    setActiveChats(prev => {
      const newChats = new Map(prev);
      newChats.delete(chatId);
      return newChats;
    });
  }, []);

  const minimizeChat = useCallback((chatId) => {
    setActiveChats(prev => {
      const newChats = new Map(prev);
      const chat = newChats.get(chatId);
      if (chat) {
        newChats.set(chatId, { ...chat, isMinimized: true });
      }
      return newChats;
    });
  }, []);

  const maximizeChat = useCallback((chatId) => {
    setActiveChats(prev => {
      const newChats = new Map(prev);
      const chat = newChats.get(chatId);
      if (chat) {
        newChats.set(chatId, { ...chat, isMinimized: false });
      }
      return newChats;
    });
  }, []);

  const toggleMinimize = useCallback((chatId) => {
    setActiveChats(prev => {
      const newChats = new Map(prev);
      const chat = newChats.get(chatId);
      if (chat) {
        newChats.set(chatId, { ...chat, isMinimized: !chat.isMinimized });
      }
      return newChats;
    });
  }, []);

  const updateUnreadCount = useCallback((chatId, count) => {
    setActiveChats(prev => {
      const newChats = new Map(prev);
      const chat = newChats.get(chatId);
      if (chat) {
        newChats.set(chatId, { ...chat, unreadCount: count });
      }
      return newChats;
    });
  }, []);

  const getActiveChats = useCallback(() => {
    return Array.from(activeChats.values());
  }, [activeChats]);

  const getChatById = useCallback((chatId) => {
    return activeChats.get(chatId);
  }, [activeChats]);

  return {
    activeChats: getActiveChats(),
    openChat,
    closeChat,
    minimizeChat,
    maximizeChat,
    toggleMinimize,
    updateUnreadCount,
    getChatById
  };
};

export default useChat;