import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriendData } from "../redux/friendSlice";
import getFriendList from "../services/Friends/getFriendList";

/**
 * Hook tải danh sách bạn bè vào Redux ngay khi user đã đăng nhập.
 * Gọi 1 lần duy nhất ở App.js để đảm bảo mọi trang đều có dữ liệu bạn bè.
 */
export function useFriendLoader() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    const fetchFriends = async () => {
      if (currentUser?._id && !isAdmin) {
        try {
          const res = await getFriendList(currentUser._id);
          if (res?.success) {
            dispatch(setFriendData(res));
          }
        } catch (error) {
          console.error("useFriendLoader: Lỗi khi tải danh sách bạn bè:", error);
        }
      }
    };
    fetchFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id, dispatch]);
}
