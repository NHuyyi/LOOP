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

  useEffect(() => {
    const fetchFriends = async () => {
      if (currentUser?._id) {
        try {
          const res = await getFriendList(currentUser._id);
          if (res?.success) {
            dispatch(setFriendData(res));
            console.log("useFriendLoader: Đã tải danh sách bạn bè vào Redux thành công!", res.friend?.length, "người bạn");
          }
        } catch (error) {
          console.error("useFriendLoader: Lỗi khi tải danh sách bạn bè:", error);
        }
      }
    };
    fetchFriends();
  }, [currentUser?._id, dispatch]);
}
