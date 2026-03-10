const express = require("express");
const router = express.Router();
const sendMessage = require("../controller/chat/sendMessage");
const getMessages = require("../controller/chat/getMessages");
const authorize = require("../middleware/Authorization");
const getConversations = require("../controller/chat/getConversations");
const markAsRead = require("../controller/chat/markAsRead");

router.post("/send", authorize, sendMessage.sendMessage);
router.get("/conversations", authorize, getConversations.getConversations);
router.get("/messages/:conversationId", authorize, getMessages.getMessages);
router.put("/mark-read/:conversationId", authorize, markAsRead.markAsRead);

module.exports = router;
