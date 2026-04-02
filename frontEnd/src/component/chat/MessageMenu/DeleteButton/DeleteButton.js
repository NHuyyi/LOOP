const DeleteButton = ({ message, closeMenu }) => {
  const handleDelete = () => {
    // Logic xóa tin nhắn (chỉ xóa ở phía mình)
    console.log("Xóa tin ở phía tôi:", message._id);
    closeMenu();
  };
  return (
    <button onClick={handleDelete} className="menu-action-btn delete-btn">
      🗑️ Xóa
    </button>
  );
};

export default DeleteButton;
