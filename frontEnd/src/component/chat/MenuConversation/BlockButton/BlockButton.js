import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../../Loading/Loading";
import ConfirmModal from "../../../common/ConfirmModal/ConfirmModal";
import blockUser from "../../../../services/User/blockUser";
import { updateBlockStatusRealtime } from "../../../../redux/chatSlice";
import style from "./BlockButton.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(style);

function BlockButton({ targetUserId, type = "in", className, onModalClose, onCloseMenu }) {
  const dispatch = useDispatch();

  const blockStatus = useSelector((state) => state.chat.blockStatus) || {};
  const isBlocked = blockStatus.isBlockedByMe;

  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCloseConfirm = (e) => {
    if(onCloseMenu) onCloseMenu(false)
    setShowConfirm(false);
    if (onModalClose) onModalClose();
  };
  // Hàm mở Modal (chặn sự kiện lan ra ngoài để không làm đóng menu 3 chấm)
  const handleOpenConfirm = (e) => {
    if (e) e.stopPropagation();
    setShowConfirm(true);
  };

  const handleToggleBlock = async () => {
    try {
      setLoading(true);
      const result = await blockUser(targetUserId);

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
      if(onCloseMenu) onCloseMenu(false)
      setLoading(false);
      setShowConfirm(false);
      if (onModalClose) onModalClose();
    }
  };

  return (
    <>
      {/* Gom chung vào 1 return và tách UI bằng toán tử ba ngôi để Modal ở dưới luôn được render */}
      {type === "out" ? (
        <button
          className={className}
          style={{
            width: "100%",
            textAlign: "left",
          }}
          onClick={handleOpenConfirm}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : isBlocked ? "Bỏ chặn" : "Chặn"}
        </button>
      ) : (
        <button
          onClick={handleOpenConfirm}
          disabled={loading}
          className={cx( isBlocked ? "blocked" : "not-blocked")}
        >
          {loading ? <Loading size="small" /> : isBlocked ? "Bỏ chặn" : "Chặn"}
        </button>
      )}

      {/* Modal được đưa ra ngoài để luôn hoạt động cho cả 2 trạng thái */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={handleCloseConfirm}
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
