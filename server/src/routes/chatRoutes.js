const express = require("express");
const { 
  startConversation,
  getConversations,
  getConversation,
  sendMessage,
  getMessages,
  markMessagesAsRead,
  getUnreadCount,
  searchMessages,
  deleteMessage,
  updateConversationStatus,
  getSellerStats,
  getRecentMessages
} = require("../controllers/chatController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// All chat routes require authentication
router.use(authenticateToken);

// Conversation routes
router.post("/conversations", startConversation);                    // POST /api/chat/conversations
router.get("/conversations", getConversations);                      // GET /api/chat/conversations
router.get("/conversations/:conversationId", getConversation);       // GET /api/chat/conversations/:id
router.put("/conversations/:conversationId/status", updateConversationStatus); // PUT /api/chat/conversations/:id/status

// Message routes
router.post("/conversations/:conversationId/messages", sendMessage); // POST /api/chat/conversations/:id/messages
router.get("/conversations/:conversationId/messages", getMessages);  // GET /api/chat/conversations/:id/messages
router.put("/conversations/:conversationId/read", markMessagesAsRead); // PUT /api/chat/conversations/:id/read
router.delete("/messages/:messageId", deleteMessage);                // DELETE /api/chat/messages/:id

// Utility routes
router.get("/unread-count", getUnreadCount);                         // GET /api/chat/unread-count
router.get("/search", searchMessages);                               // GET /api/chat/search?q=term
router.get("/recent", getRecentMessages);                            // GET /api/chat/recent?minutes=5

// Seller specific routes
router.get("/seller/stats", getSellerStats);                         // GET /api/chat/seller/stats

module.exports = router;