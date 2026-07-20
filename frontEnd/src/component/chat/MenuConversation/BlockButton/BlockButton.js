import React, { useEffect, useState } from "react";
import Loading from "../../../Loading/Loading";
import ConfirmModal from "../../../common/ConfirmModal/ConfirmModal";
import blockUser from "../../../../services/User/blockUser";
import checkBlockStatus from "../../../../services/User/checkBlockStatus";

function BlockButton({ targetUserId }) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const loadStatus = async () => {
      if (!targetUserId) return;

      try {
        const result = await checkBlockStatus(targetUserId);

        if (result.success) {
          setIsBlocked(result.data?.state === "blocked-by-me");
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadStatus();
  }, [targetUserId]);

  const handleToggleBlock = async () => {
    try {
      setLoading(true);

      const result = await blockUser(targetUserId);

      if (!result.success) {
        throw new Error(result.message);
      }

      setIsBlocked(Boolean(result.data?.blocked));
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
