const express = require("express");
const router = express.Router();
const sendMessage = require("../controller/chat/sendMessage");
const getMessages = require("../controller/chat/getMessages");
const authorize = require("../middleware/authorize");
const Authorization = require("../middleware/Authorization");
const getConversations = require("../controller/chat/conversation/getConversations");
const markAsRead = require("../controller/chat/markAsRead");
const reactMessage = require("../controller/chat/reactMessage");
const deleteMessage = require("../controller/chat/deleteMessage");
const revokeMessage = require("../controller/chat/revokeMessage");
const deleteConversation = require("../controller/chat/conversation/deleteCoversation");
const getConversationImages = require("../controller/chat/conversation/getConversationImages");
const toggleMuteConversation = require("../controller/chat/conversation/toggleMuteConversation");
const getRestrictedConversations = require("../controller/chat/conversation/getRestrictedConversations");
const toggleRestrictConversation = require("../controller/chat/conversation/toggleRestrictConversation");

router.post("/send", Authorization, authorize("user"), sendMessage.sendMessage);
router.get("/conversations", Authorization, authorize("user"), getConversations.getConversations);
router.get("/messages/:conversationId", Authorization, authorize("user"), getMessages.getMessages);
router.put("/mark-read/:conversationId", Authorization, authorize("user"), markAsRead.markAsRead);
router.post("/react", Authorization, authorize("user"), reactMessage.reactMessage);
router.put(
  "/delete-message/:messageId",
  Authorization, authorize("user"),
  deleteMessage.deleteMessage,
);
router.put(
  "/revoke-message/:messageId",
  Authorization, authorize("user"),
  revokeMessage.revokeMessage,
);
router.put(
  "/delete-conversation/:conversationId",
  Authorization, authorize('user'),
  deleteConversation.deleteConversation,
);
router.get(
  "/conversation-images/:conversationId",
  Authorization, authorize("user"),
  getConversationImages.getConversationImages,
);

router.put(
  "/toggle-mute/:conversationId",
  Authorization, authorize("user"),
  toggleMuteConversation.toggleMuteConversation,
);

router.get(
  "/restricted-conversations",
  Authorization, authorize("user"),
  getRestrictedConversations.getRestrictedConversations,
);
router.put(
  "/toggle-restrict/:conversationId",
  Authorization, authorize("user"),
  toggleRestrictConversation.toggleRestrictConversation,
);

module.exports = router;
