import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "../socker";
import { getUserbyId } from "../services/User/getUserbyId";
import { setUser } from "../redux/userSlice";
import { updateReaction } from "../redux/reactionSlide";
import { setOnlineUsers } from "../redux/onlineSlice";
import {
  setComments,
  updateCommentReaction,
  deleteComment,
} from "../redux/commentSlide";
import { getCommentList } from "../services/Post/comments/getCommentList";

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

      socket.on(
        "reactionUpdated",
        ({ postId, reactionCounts, totalReactions }) => {
          console.log(
            "📩 Reaction update:",
            postId,
            reactionCounts,
            totalReactions
          );
          dispatch(updateReaction({ postId, reactionCounts, totalReactions }));
        }
      );

      socket.on("update-online-users", (onlineUserIds) => {
        dispatch(setOnlineUsers(onlineUserIds));
      });

      socket.on("createComments", async (payload) => {
        const token = localStorage.getItem("token");
        const res = await getCommentList(payload.postId, token);
        if (res?.data) {
          dispatch(setComments({ postId: payload.postId, comments: res.data }));
        }
      });

      socket.on(
        "UpdateReactComment",
        ({ postId, commentId, reactionCounts, totalReactions }) => {
          console.log(
            "📩 Reaction update:",
            postId,
            commentId,
            reactionCounts,
            totalReactions
          );
          dispatch(
            updateCommentReaction({
              postId,
              commentId,
              reactionCounts,
              totalReactions,
            })
          );
        }
      );
      socket.on("Deletecomment", ({ postid, comment }) => {
        console.log("📩 Comment bị xóa mềm:", comment);

        // dispatch trực tiếp reducer deleteComment
        dispatch(deleteComment({ postId: postid, commentId: comment._id }));
      });
    }

    return () => {
      socket.off("friendRemoved");
      socket.off("friendRequestReceived");
      socket.off("friendRequestAccepted");
      socket.off("reactionUpdated");
      socket.off("update-online-users");
      socket.off("createComments");
      socket.off("Deletecomment");
    };
  }, [currentUser, dispatch]);

  return null; // component này không render gì, chỉ để quản lý socket
}

export default SocketManager;
