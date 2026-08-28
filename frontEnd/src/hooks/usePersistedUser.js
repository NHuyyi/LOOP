import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, setNotiSettings } from "../redux/userSlice";
import { getSettingsSounds } from "../services/notifications/getNotiSettings";

export function usePersistedUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const saved = localStorage.getItem("userData");
    if (saved) {
      const parsed = JSON.parse(saved);
      dispatch(setUser(parsed));

      // Nạp dữ liệu âm thanh
      getSettingsSounds().then((res) => {
        if (res.success && res.data) {
          dispatch(setNotiSettings(res.data));
        }
      });
    }
  }, [dispatch]);
}