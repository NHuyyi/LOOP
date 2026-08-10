import { useEffect, useState, useMemo } from "react";
import { checkstatusfriend } from "../services/Friends/checkstatusfriend";
import { useSelector } from "react-redux";

export default function useFriendStatus(currentUserId, targetId) {
  // Lấy dữ liệu từ Redux
  const { friends, friendRequests, sentRequests } = useSelector(
    (state) => state.friend
  );

  const reduxStatus = useMemo(() => {
    if (!targetId) return null;


    const safeTargetId = String(targetId);

    const isFriend = friends.some((f) => String(f?._id || f) === safeTargetId);
    if (isFriend) return "friends";

    const isSent = sentRequests.some((r) => String(r?.to?._id || r?.to) === safeTargetId);
    if (isSent) return "requestSent";

    const isReceived = friendRequests.some((r) => String(r?.from?._id || r?.from) === safeTargetId);
    if (isReceived) return "requestReceived";

    return null; // Không có trong Redux
  }, [targetId, friends, friendRequests, sentRequests]);


  const [apiStatus, setApiStatus] = useState("none");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (reduxStatus) return;
    if (!currentUserId || !targetId) return;

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const res = await checkstatusfriend(currentUserId, targetId);
        setApiStatus(res.status);
      } catch (error) {
        console.error("Lỗi khi fetch friend status:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [currentUserId, targetId, reduxStatus]);

  const finalStatus = reduxStatus || apiStatus;

  return {
    status: finalStatus,
    setStatus: setApiStatus,
    loading: reduxStatus ? false : loading // Nếu có trên Redux thì dừng loading ngay
  };
}