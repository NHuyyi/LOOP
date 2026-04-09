const RevokeButton = ({ message, closeMenu }) => {
  const handleRevoke = () => {
    // Logic thu hồi tin nhắn (xóa ở cả 2 phía - cần gọi API)
    console.log("Thu hồi tin:", message._id);
    closeMenu();
  };
  return (
    <button onClick={handleRevoke} className="menu-action-btn revoke-btn">
      Thu hồi
    </button>
  );
};

export default RevokeButton;
