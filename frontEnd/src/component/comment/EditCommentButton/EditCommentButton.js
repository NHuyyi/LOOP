import classNames from "classnames/bind";
import styles from "./commentActions.module.css";
import { FaEdit } from "react-icons/fa";

const cx = classNames.bind(styles);

function EditCommentButton({ comment, onEdit }) {
  return (
    <span
      className={cx("action")}
      onClick={() =>
        // những gì cần chuyển ngược về cho cha
        onEdit({
          _id: comment._id,
          text: comment.text,
          mode: "edit",
        })
      }
    >
      <FaEdit />
    </span>
  );
}
export default EditCommentButton;
