import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

export function usePersistedUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    const saved = localStorage.getItem("userData");
    if (saved) {
      const parsed = JSON.parse(saved); // { user, token }
      dispatch(setUser(parsed)); // không bị lồng nữa
    }
  }, [dispatch]);
}
