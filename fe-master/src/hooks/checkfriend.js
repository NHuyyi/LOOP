// hooks/useFriendStatus.js
import { useEffect, useState } from "react";
import { checkstatusfriend } from "../services/Friends/checkstatusfriend";

export default function useFriendStatus(currentUserId, targetId) {
  const [status, setStatus] = useState("none");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId || !targetId) return;

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const res = await checkstatusfriend(currentUserId, targetId);
        setStatus(res.status);
      } catch (error) {
        console.error("Lỗi khi fetch friend status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [currentUserId, targetId]);

  return { status, setStatus, loading };
}
