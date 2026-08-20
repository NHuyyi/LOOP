import { useEffect, useState } from "react";
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
  markConversationAsRead,
  setTyping,
  revokeMessageInState,
  updateBlockStatusRealtime,
  moveConversationToBlocked,
  removeConversationFromBlocked,
  removeConversationInState
} from "../redux/chatSlice";

import { clearUser } from "../redux/userSlice";


import { useLocation } from "react-router-dom";

function SocketManager() {
  const currentUser = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const location = useLocation();

  const conversationList = useSelector((state) => state.chat.ConversationList);
  const activeConversationId = useSelector(
    (state) => state.chat.activeConversationId,
  );

  const restrictedConversationList = useSelector(
    (state) => state.chat.RestrictedConversationList,
  );

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setFadeOut(true);
      }, 2500);
      const removeTimer = setTimeout(() => {
        setMessage("");
        setFadeOut(false);
      }, 3000);
      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }
  }, [message]);

  useEffect(() => {

    if (currentUser?._id) {
      socket.emit("register", currentUser._id);

      socket.on("forceLogout", (data) => {
        const currentDeviceId = localStorage.getItem("deviceId");

        if (currentDeviceId && data.deviceId === currentDeviceId) {
          setMessage("Thiết bị này vừa bị đăng xuất từ xa!");
          setSuccess(false);

          dispatch(clearUser());
          localStorage.removeItem("token");
          localStorage.removeItem("userData");

          // Đợi thông báo biến mất rồi chuyển hướng
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        }
      });

      socket.on("friendRemoved", ({ by, conversationId }) => {
        dispatch(removeFriend(by));
        // Xóa luôn conversation bên phía người bị xóa
        if (conversationId) {
          dispatch(removeConversationInState(conversationId));
        }
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

      socket.on("newMessage", ({ conversationId, message, isRestricted }) => {
        const conversation =
          conversationList.find(
            (conv) => String(conv._id) === String(conversationId),
          ) ||
          restrictedConversationList.find(
            (conv) => String(conv._id) === String(conversationId),
          );

        const isMuted = conversation?.mutedBy?.includes(currentUser._id);
        const finalIsRestricted =
          isRestricted || conversation?.restrictedBy?.includes(currentUser._id);
        const isChatpage = location.pathname.startsWith("/chat");

        dispatch(addMessage({ conversationId, message }));

        if (!finalIsRestricted) {
          if (isMuted) {
            dispatch(
              updateLastMessage({
                conversationId,
                message,
                reorder: false,
              }),
            );
          } else {
            dispatch(updateLastMessage({ conversationId, message }));
          }

          if (message.senderId) {
            const senderId = message.senderId?._id || message.senderId;
            dispatch(
              updateChatInFilteredFriends({
                friendId: senderId,
                conversationId,
              }),
            );
          }

          if (!isChatpage && !isMuted) {
            // Lấy người dùng còn lại trong conversation
            // GIỐNG HỆT CÁCH MiniChatPortal ĐANG LÀM
            const otherUser = conversation?.participants?.find(
              (p) => String(p._id) !== String(currentUser._id),
            );

            // Chỉ mở MiniChat nếu tìm được user
            if (otherUser) {
              dispatch(
                OpenMiniChat({
                  receiver: otherUser,
                  conversationId,
                  triggerBy: "socket",
                }),
              );
            }
          }
        }
      });
      // This event is listens for forwarded messages and updates the last message,
      socket.on("updateLastMessage", ({ conversationId, message }) => {
        dispatch(updateLastMessage({ conversationId, message }));
      });

      socket.on("UpdateReactionMessage", (data) => {
        dispatch(UpdateReactionMessage(data));
      });

      socket.on("messageRead", ({ conversationId, readerId }) => {
        // Dùng readerId (ID của người vừa đọc tin nhắn) truyền vào làm currentUserId.
        // Bằng cách này, reducer sẽ hiểu: "Nếu người gửi (mình) khác với người đọc (họ), thì chuyển status thành 'read'"
        dispatch(
          markConversationAsRead({
            conversationId: conversationId,
            currentUserId: readerId,
          }),
        );
      });

      // LẮNG NGHE TYPING
      socket.on("userTyping", ({ conversationId }) => {
        dispatch(setTyping({ conversationId, isTyping: true }));
      });

      socket.on("userStopTyping", ({ conversationId }) => {
        dispatch(setTyping({ conversationId, isTyping: false }));
      });

      socket.on("messageRevoked", (data) => {
        const { messageId, conversationId } = data;
        dispatch(revokeMessageInState({ messageId, conversationId }));
      });

      socket.on("blockStatusChanged", (data) => {
        dispatch(
          updateBlockStatusRealtime({
            isBlockedByMe: data.isBlockedByMe,
            isBlockedByThem: data.isBlockedByThem,
          }),
        );
        if (data.conversation) {
          if (data.isBlockedByMe) {
            // Nếu mình chặn họ -> Văng khỏi list chat bình thường, chuyển sang list chặn
            dispatch(moveConversationToBlocked(data.conversation));
          } else {
            // Nếu mình bỏ chặn -> Trả lại vào list chat bình thường
            dispatch(removeConversationFromBlocked(data.conversation));
          }
        }
      });
    }

    return () => {
      socket.off("forceLogout");
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
      socket.off("UpdateReactComment");
      socket.off("commentUpdated");
      socket.off("UpdateReactionMessage");
      socket.off("messageRead");
      socket.off("userTyping");
      socket.off("userStopTyping");
      socket.off("updateLastMessage");
      socket.off("messageRevoked");
      socket.off("blockStatusChanged");
    };
  }, [
    currentUser,
    dispatch,
    location.pathname,
    activeConversationId,
    conversationList,
    restrictedConversationList,
  ]);

  return (
    <>
      {message && (
        <div
          className={`app-message ${success === false ? "app-message__err" : "app-message__ok"
            } ${fadeOut ? "fade-out" : ""}`}
        >
          {message}
        </div>
      )}
    </>
  );

}

export default SocketManager;
