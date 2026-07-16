const express = require("express");
const router = express.Router();
const sendMessage = require("../controller/chat/sendMessage");
const getMessages = require("../controller/chat/getMessages");
const authorize = require("../middleware/Authorization");
const getConversations = require("../controller/chat/conversation/getConversations");
const markAsRead = require("../controller/chat/markAsRead");
const reactMessage = require("../controller/chat/reactMessage");
const deleteMessage = require("../controller/chat/deleteMessage");
const revokeMessage = require("../controller/chat/revokeMessage");
const deleteConversation = require("../controller/chat/conversation/deleteCoversation");
const getConversationImages = require("../controller/chat/conversation/getConversationImages");
const toggleMuteConversation = require("../controller/chat/conversation/toggleMuteConversation");

router.post("/send", authorize, sendMessage.sendMessage);
router.get("/conversations", authorize, getConversations.getConversations);
router.get("/messages/:conversationId", authorize, getMessages.getMessages);
router.put("/mark-read/:conversationId", authorize, markAsRead.markAsRead);
router.post("/react", authorize, reactMessage.reactMessage);
router.put(
  "/delete-message/:messageId",
  authorize,
  deleteMessage.deleteMessage,
);
router.put(
  "/revoke-message/:messageId",
  authorize,
  revokeMessage.revokeMessage,
);
router.put(
  "/delete-conversation/:conversationId",
  authorize,
  deleteConversation.deleteConversation,
);
router.get(
  "/conversation-images/:conversationId",
  authorize,
  getConversationImages.getConversationImages,
);

router.put(
  "/toggle-mute/:conversationId",
  authorize,
  toggleMuteConversation.toggleMuteConversation,
);

module.exports = router;
