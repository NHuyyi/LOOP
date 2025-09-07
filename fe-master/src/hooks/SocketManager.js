import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "../socker";
import { getUserbyId } from "../services/User/getUserbyId";
import { setUser } from "../redux/userSlice";

function SocketManager() {
  const currentUser = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("testEvent", (data) => {
      console.log("📩 Nhận testEvent:", data);
      alert(`Nhận testEvent: ${data.msg}`);
    });

    if (currentUser?._id) {
      socket.emit("register", currentUser._id);

      socket.on("friendRemoved", async (data) => {
        console.log("Bạn bị xoá bởi:", data.by);
        const updatedUser = await getUserbyId(currentUser._id);
        dispatch(
          setUser({ user: updatedUser, token: localStorage.getItem("token") })
        );
      });

      socket.on("friendRequestReceived", async ({ by }) => {
        console.log("📩 Lời mời được chấp nhận bởi:", by);
        // Re-fetch user để update danh sách request
        const updatedUser = await getUserbyId(currentUser._id);
        dispatch(
          setUser({ user: updatedUser, token: localStorage.getItem("token") })
        );
      });

      socket.on("friendRequestAccepted", async ({ by }) => {
        console.log("📩 Lời mời được chấp nhận bởi:", by);

        const updatedUser = await getUserbyId(currentUser._id);
        dispatch(
          setUser({ user: updatedUser, token: localStorage.getItem("token") })
        );
      });

      socket.on("friendRequestCancle", async ({ by }) => {
        console.log("📩 Lời mời đã được hủy bởi:", by);
        // Re-fetch user để update danh sách request
        const updatedUser = await getUserbyId(currentUser._id);
        dispatch(
          setUser({ user: updatedUser, token: localStorage.getItem("token") })
        );
      });

      socket.on("friendRequestReject", async ({ by }) => {
        console.log("📩 Lời mời bị tử chối bởi:", by);
        // Re-fetch user để update danh sách request
        const updatedUser = await getUserbyId(currentUser._id);
        dispatch(
          setUser({ user: updatedUser, token: localStorage.getItem("token") })
        );
      });
    }

    return () => {
      socket.off("friendRemoved");
      socket.off("friendRequestReceived");
      socket.off("friendRequestAccepted");
    };
  }, [currentUser, dispatch]);

  return null; // component này không render gì, chỉ để quản lý socket
}

export default SocketManager;
