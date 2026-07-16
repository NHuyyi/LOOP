import React, { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toggleMuteConversationAPI } from "../../../../services/chat/toggleMuteConversation";

import { updateConversationMuteStatus } from "../../../../redux/chatSlice";

import style from "../MenuConversation.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(style);

const ToggleMuteButton = ({ conversationId, initialIsMuted = false }) => {
  const [isMuted, setIsMuted] = useState(initialIsMuted);
  const currentUser = useSelector((state) => state.user.user);

  const dispatch = useDispatch(); // Khởi tạo dispatch

  useEffect(() => {
    setIsMuted(initialIsMuted);
  }, [initialIsMuted]);

  const handleToggleMute = async () => {
    if (!conversationId) return;

    const previousState = isMuted;
    const newState = !isMuted;

    setIsMuted(newState);

    const userId = currentUser?._id;
    
    if (userId) {
      
      dispatch(
        updateConversationMuteStatus({
          conversationId,
          userId,
          isMuted: newState,
        }),
      );
    }

    try {
      const token = currentUser?.token || currentUser?.accessToken;
      await toggleMuteConversationAPI(conversationId, token);
    } catch (error) {
      console.error("Lỗi khi tắt/bật thông báo:", error);

      setIsMuted(previousState);
      if (userId) {
        dispatch(
          updateConversationMuteStatus({
            conversationId,
            userId,
            isMuted: previousState,
          }),
        );
      }
    }
  };

  return (
    <button
      className={cx("actionBtn")}
      onClick={handleToggleMute}
      title={isMuted ? "Bật thông báo" : "Tắt thông báo"}
    >
      {isMuted ? <BellOff size={24} /> : <Bell size={24} />}
    </button>
  );
};

export default ToggleMuteButton;
