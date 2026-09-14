import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications } from "../redux/notificationSlice";
import { getNotificationList } from "../services/notifications/getNotificationList";

export function useNotificationLoader() {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.user);

    useEffect(() => {
        const fetchNotis = async () => {
            if (currentUser?._id) {
                const res = await getNotificationList();
                if (res?.success && res.data) {
                    dispatch(setNotifications(res.data)); // Đẩy mảng thông báo vào Redux
                    console.log("res", res)
                }
            }
        };
        fetchNotis();
    }, [currentUser?._id, dispatch]);
}