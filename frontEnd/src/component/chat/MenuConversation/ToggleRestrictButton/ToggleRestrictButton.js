import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleRestrictConversationAPI } from "../../../../services/chat/toggleRestrictConversation";
import {
  moveConversationToRestricted,
  moveConversationToNormal,
} from "../../../../redux/chatSlice";
import ConfirmModal from "../../../common/ConfirmModal/ConfirmModal";
import Loading from "../../../Loading/Loading";
import style from "../MenuConversation.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(style);

function ToggleRestrictButton({
  conversationId,
  isRestricted,
  className,
  type = "in",
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();

  const handleOpenConfirm = (e) => {
    if (e) e.stopPropagation();
    setShowConfirm(true);
  };

  const handleToggle = async () => {
    setIsProcessing(true);
    try {
      const res = await toggleRestrictConversationAPI(conversationId);

      if (res.success) {
        // Backend trả về updated conversation, ta dispatch thẳng vào Redux
        if (res.isRestricted) {
          dispatch(moveConversationToRestricted(res.conversation));
        } else {
          dispatch(moveConversationToNormal(res.conversation));
        }
        setShowConfirm(false);
      }
    } catch (error) {
      console.error("Lỗi thay đổi trạng thái hạn chế:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {type === "out" ? (
        <button
          className={cx("menu-item")}
          onClick={handleOpenConfirm}
          disabled={isProcessing}
        >
          {isProcessing
            ? "Đang xử lý..."
            : isRestricted
              ? "Bỏ hạn chế"
              : "Hạn chế"}
        </button>
      ) : (
        <button
          className={className}
          onClick={() => setShowConfirm(true)}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loading size="small" />
          ) : isRestricted ? (
            "Bỏ hạn chế"
          ) : (
            "Hạn chế"
          )}
        </button>
      )}

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleToggle}
        title={
          isRestricted
            ? "Bỏ hạn chế cuộc trò chuyện"
            : "Hạn chế cuộc trò chuyện"
        }
        message={
          isRestricted
            ? "Người này sẽ được khôi phục trạng thái hoạt động bình thường trong danh sách Chat. Bạn có chắc chắn?"
            : "Cuộc trò chuyện này sẽ bị ẩn khỏi danh sách chính và bạn sẽ không nhận được thông báo mới. Bạn có chắc chắn?"
        }
        isProcessing={isProcessing}
      />
    </>
  );
}

export default ToggleRestrictButton;
