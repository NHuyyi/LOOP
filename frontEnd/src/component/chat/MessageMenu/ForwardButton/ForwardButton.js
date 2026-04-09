const ForwardButton = ({ message, closeMenu }) => {
  const handleForward = () => {
    // Logic mở modal chọn người để chuyển tiếp
    console.log("Chuyển tiếp tin:", message._id);
    closeMenu();
  };
  return (
    <button onClick={handleForward} className="menu-action-btn">
      Chuyển tiếp
    </button>
  );
};

export default ForwardButton;
