import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../Loading/Loading";
import ConfirmModal from "../../../common/ConfirmModal/ConfirmModal";
import blockUser from "../../../../services/User/blockUser";
import { updateBlockStatusRealtime } from "../../../../redux/chatSlice"; // Import action

function BlockButton({ targetUserId }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);

  // Lấy trạng thái block TỪ REDUX thay vì tự quản lý bằng useState
  const blockStatus = useSelector((state) => state.chat.blockStatus) || {};
  const isBlocked = blockStatus.isBlockedByMe; // True nếu mình đang chặn đối phương

  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleToggleBlock = async () => {
    try {
      setLoading(true);
      // Gọi API lên Backend
      const result = await blockUser(targetUserId);
      console.log("Kết quả từ API:", result);

      if (!result.success) {
        throw new Error(result.message);
      }

      dispatch(
        updateBlockStatusRealtime({
          isBlockedByMe: result.data.isBlockedByMe,
          isBlockedByThem: result.data.isBlockedByThem,
        }),
      );
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        style={{
          padding: "8px 12px",
          borderRadius: "8px",
          border: "none",
          background: isBlocked ? "#f59e0b" : "#dc2626",
          color: "#fff",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? <Loading size="small" /> : isBlocked ? "Bỏ chặn" : "Chặn"}
      </button>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleToggleBlock}
        title={isBlocked ? "Bỏ chặn đối phương?" : "Chặn đối phương?"}
        message={
          isBlocked
            ? "Bạn có chắc muốn bỏ chặn đối phương không?"
            : "Bạn có chắc muốn chặn đối phương không?"
        }
        isProcessing={loading}
      />
    </>
  );
}

export default BlockButton;
