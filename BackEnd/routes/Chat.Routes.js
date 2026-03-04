const express = require("express");
const router = express.Router();
const sendMessage = require("../controller/chat/sendMessage");
const getMessages = require("../controller/chat/getMessages");
const authorize = require("../middleware/Authorization");
const getConversations = require("../controller/chat/getConversations");

router.post("/send", authorize, sendMessage.sendMessage);
router.get("/conversations", authorize, getConversations.getConversations);
router.get("/messages/:conversationId", authorize, getMessages.getMessages);

module.exports = router;
