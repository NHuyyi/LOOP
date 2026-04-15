// frontEnd/src/component/chat/MessageMenu/ForwardModal/ForwardModal.js
import React, { useState, useEffect } from "react";
import styles from "./ForwardModal.module.css";
import classNames from "classnames/bind";
import { useSelector } from "react-redux";
import { X } from "lucide-react";

// Import API Get FriendLists and sendMessage
import getFriendList from "../../../../../services/Friends/getFriendList"; // Adjust path if needed
import { sendMessage } from "../../../../../services/chat/sendMessage"; // Adjust path if needed
import Loading from "../../../../Loading/Loading";
const cx = classNames.bind(styles);

const ForwardModal = ({ message, onClose }) => {
  const [searchText, setSearchText] = useState(""); // This state is used to filter the friend list when the user searches
  const [selectedUsers, setSelectedUsers] = useState([]); // This array is used to store the list of selected user IDs in order to forward the message
  const [friendLists, setFriendLists] = useState([]); // This array is used to store the list of friends that we display in the modal
  const [isLoadingFriends, setIsLoadingFriends] = useState(true); // This state is used to show a loading while the system is fetching the friend list
  const [isSending, setIsSending] = useState(false);

  // this codes to gets the current user's information from redux store
  const stateUser = useSelector((state) => state.user);
  const currentUser = stateUser?.user;

  // this effect fetches the friend list automatically when the modal is opened
  useEffect(() => {
    const fetchFriendLists = async () => {
      if (!currentUser?._id) return;
      try {
        setIsLoadingFriends(true);
        const response = await getFriendList(currentUser._id);
        if (response.success) {
          setFriendLists(response.friend || []);
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách bạn bè:", err);
      } finally {
        setIsLoadingFriends(false);
      }
    };
    fetchFriendLists();
  }, [currentUser]);

  // this variable stores the  friend list after it is filtered by the search text
  const filteredUsers = friendLists.filter((friend) =>
    friend.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  // This function toggles the selected user when you click on a user item
  // first, the function checks if the user's ID is aready in the selectedUsers array by using the includes() method.
  // If the ID is already in the array, it will be removed. If it is not, the ID will be added to the array
  const toggleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // This function handles sending the forwarded message by calling the sendMessage API
  const handleSendForward = async () => {
    if (selectedUsers.length === 0) return;
    setIsSending(true);

    try {
      // This for-loop sends the message to each selected user individually(riêng lẻ)
      for (const receiverId of selectedUsers) {
        await sendMessage({
          receiverId: receiverId,
          text: message.text, // get the text from the message to forward
          isForwarded: true, // This boolean property(thuộc tính) indicates(chỉ ra) that the message is a forwarded message
        });
      }

      // If the message is forwarded successfully, the function will close the modal.
      onClose();
    } catch (error) {
      console.error("Lỗi khi chuyển tiếp:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={cx("modal-overlay")}>
      <div className={cx("modal-content")}>
        {/* Header */}
        <div className={cx("header")}>
          <h3>Chuyển tiếp tin nhắn</h3>
          <button
            className={cx("close-btn")}
            onClick={onClose}
            disabled={isSending}
          >
            <X size={20} />
          </button>
        </div>

        {/* Thanh tìm kiếm */}
        <div className={cx("search-box")}>
          <input
            type="text"
            placeholder="Tìm kiếm bạn bè..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Danh sách người dùng */}
        <div className={cx("user-list")}>
          {isLoadingFriends ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <Loading size="small" />
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className={cx("user-item")}
                onClick={() => toggleSelectUser(user._id)}
              >
                <img
                  src={
                    user.avatar ||
                    "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
                  }
                  alt="avatar"
                  className={cx("avatar")}
                />
                <span className={cx("user-name")}>{user.name}</span>
                <div className={cx("checkbox-container")}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => toggleSelectUser(user._id)}
                    onClick={(e) => e.stopPropagation()} // Tránh bị click đúp
                  />
                </div>
              </div>
            ))
          ) : (
            <p
              style={{ textAlign: "center", color: "#888", marginTop: "20px" }}
            >
              Không tìm thấy kết quả
            </p>
          )}
        </div>

        {/* Footer chứa các nút hành động */}
        <div className={cx("footer")}>
          <button
            className={cx("cancel-btn")}
            onClick={onClose}
            disabled={isSending}
          >
            Hủy
          </button>
          <button
            className={cx("send-btn")}
            disabled={selectedUsers.length === 0 || isSending}
            onClick={handleSendForward}
          >
            {isSending ? "Đang gửi..." : "Gửi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForwardModal;
