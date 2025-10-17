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
  updateComment,
} from "../redux/commentSlide";
import { getCommentList } from "../services/Post/comments/getCommentList";
import getpost from "../services/Post/getpost";
import { setPosts, DeletePosts, addPost, updatePost } from "../redux/postSlice";

function SocketManager() {
  const currentUser = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("testEvent", (data) => {
      alert(`Nhận testEvent: ${data.msg}`);
    });

    if (currentUser?._id) {
      socket.emit("register", currentUser._id);

      socket.on("friendRemoved", async () => {
        const updatedUser = await getUserbyId(currentUser._id);
        dispatch(
          setUser({ user: updatedUser, token: localStorage.getItem("token") })
        );
      });

      socket.on("friendRequestReceived", async () => {
        // Re-fetch user để update danh sách request
        const updatedUser = await getUserbyId(currentUser._id);
        dispatch(
          setUser({ user: updatedUser, token: localStorage.getItem("token") })
        );
      });

      socket.on("friendRequestAccepted", async () => {
        const updatedUser = await getUserbyId(currentUser._id);
        dispatch(
          setUser({ user: updatedUser, token: localStorage.getItem("token") })
        );
      });

      socket.on("friendRequestCancle", async () => {
        // Re-fetch user để update danh sách request
        const updatedUser = await getUserbyId(currentUser._id);
        dispatch(
          setUser({ user: updatedUser, token: localStorage.getItem("token") })
        );
      });

      socket.on("friendRequestReject", async ({ by }) => {
        // Re-fetch user để update danh sách request
        const updatedUser = await getUserbyId(currentUser._id);
        dispatch(
          setUser({ user: updatedUser, token: localStorage.getItem("token") })
        );
      });

      socket.on(
        "reactionUpdated",
        ({ postId, reactionCounts, totalReactions }) => {
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
        // dispatch trực tiếp reducer deleteComment
        dispatch(deleteComment({ postId: postid, commentId: comment._id }));
      });

      socket.on("commentUpdated", async (payload) => {
        const token = localStorage.getItem("token");
        const res = await getCommentList(payload.postId, token);
        if (res?.data) {
          dispatch(
            updateComment({ postId: payload.postId, comment: payload.comment })
          );
        }
      });
      socket.on("createPost", ({ post }) => {
        dispatch(addPost(post));
      });

      socket.on("Deletepost", ({ postid }) => {
        // dispatch trực tiếp reducer deletePost
        dispatch(DeletePosts({ postId: postid }));
      });

      socket.on("postEdited", ({ post }) => {
        dispatch(updatePost({ post }));
      });

      socket.on("postVisibilityChanged", async ({ post }) => {
        // Lấy lại danh sách post mới
        const res = await getpost(currentUser.friends, currentUser._id);
        if (res?.success && res.data) {
          dispatch(setPosts(res.data));
        }
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
      socket.off("createPost");
      socket.off("Deletepost");
      socket.off("postEdited");
      socket.off("postVisibilityChanged");
    };
  }, [currentUser, dispatch]);

  return null; // component này không render gì, chỉ để quản lý socket
}

export default SocketManager;
