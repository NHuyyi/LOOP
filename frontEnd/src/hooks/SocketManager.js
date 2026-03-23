import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import socket from "../socker";
import {
  receiveFriendRequest,
  cancelReceivedRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  updateChatInFilteredFriends,
} from "../redux/friendSlice";
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
import {
  addMessage,
  updateLastMessage,
  OpenMiniChat,
  UpdateReactionMessage,
} from "../redux/chatSlice";

import { useLocation } from "react-router-dom";

function SocketManager() {
  const currentUser = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const location = useLocation();

  useEffect(() => {
    socket.on("testEvent", (data) => {
      alert(`Nhận testEvent: ${data.msg}`);
    });

    if (currentUser?._id) {
      socket.emit("register", currentUser._id);

      socket.on("friendRemoved", ({ by }) => {
        dispatch(removeFriend(by));
      });

      socket.on("friendRequestReceived", ({ senderInfo }) => {
        // Nhớ sửa Backend để gửi thêm senderInfo nhé
        if (senderInfo) dispatch(receiveFriendRequest(senderInfo));
      });

      socket.on("friendRequestAccepted", ({ by }) => {
        dispatch(acceptFriendRequest(by));
      });

      socket.on("friendRequestCancle", ({ by }) => {
        dispatch(cancelReceivedRequest(by));
      });

      socket.on("friendRequestReject", ({ by }) => {
        dispatch(rejectFriendRequest(by));
      });

      socket.on(
        "reactionUpdated",
        ({ post, reactionCounts, totalReactions }) => {
          dispatch(
            updateReaction({
              postId: post._id,
              reactionCounts,
              totalReactions,
            }),
          );

          // updatePost phải truyền post trực tiếp
          dispatch(updatePost(post));
        },
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
            }),
          );
        },
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
            updateComment({ postId: payload.postId, comment: payload.comment }),
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

      socket.on("newMessage", ({ conversationId, message }) => {
        // 1. Nếu đang mở khung chat của người này, thêm tin nhắn mới vào mảng hiện tại
        dispatch(addMessage({ conversationId, message }));

        // 2. Cập nhật tin nhắn cuối cùng ở danh sách hội thoại và đẩy người đó lên Top 1
        dispatch(updateLastMessage({ conversationId, message }));

        const senderId = message.senderId;

        if (senderId) {
          dispatch(
            updateChatInFilteredFriends({
              friendId: senderId,
              conversationId: conversationId,
            }),
          );

          socket.on("UpdateReactionMessage", (data) => {
            dispatch(UpdateReactionMessage(data));
            console.log("Dữ liệu nhận được từ server:", data);
          });
        }

        // mở minichat khi không ở trang chat chính mà có người gửi tin nhắn đến
        const isChatpage = location.pathname.startsWith("/chat");
        if (!isChatpage && message.senderId) {
          dispatch(
            OpenMiniChat({
              receiver: { _id: message.senderId },
              conversationId,
            }),
          );
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
      socket.off("newMessage");
    };
  }, [currentUser, dispatch, location.pathname]);

  return null; // component này không render gì, chỉ để quản lý socket
}

export default SocketManager;
