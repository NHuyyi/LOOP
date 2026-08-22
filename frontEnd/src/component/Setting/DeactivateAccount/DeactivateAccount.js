import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./DeactivateAccount.module.css";
import { deactivateAccount } from "../../../services/User/deactivateAccount";
import { clearUser } from "../../../redux/userSlice";
import { UserX } from "lucide-react";
import Loading from "../../Loading/Loading";
// Import ConfirmModal
import ConfirmModal from "../../common/ConfirmModal/ConfirmModal";

const cx = classNames.bind(styles);

function DeactivateAccount() {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleConfirmDeactivate = async () => {
        setLoading(true); // Kích hoạt isProcessing trong ConfirmModal
        const res = await deactivateAccount();
        setLoading(false);

        if (res.success) {
            setShowModal(false);
            dispatch(clearUser());
            navigate("/");
        } else {
            alert(res.message);
        }
    };

    return (
        <div className={cx("container")}>
            <h3 className={cx("title")}>Vô hiệu hóa tài khoản</h3>
            <div className={cx("warning-box")}>
                <UserX size={24} />
                <span>Thao tác này sẽ ẩn tài khoản của bạn. Đăng nhập lại để khôi phục.</span>
            </div>
            <div className={cx("setting-item")}>
                <div className={cx("setting-info")}>
                    <h4>Vô hiệu hóa tạm thời</h4>
                    <p>Mọi người sẽ không thể tìm kiếm bạn. Tuy nhiên dữ liệu tin nhắn, bài viết vẫn được giữ nguyên.</p>
                </div>
                <button
                    className={cx("deactivate-btn")}
                    onClick={() => setShowModal(true)}
                    disabled={loading}
                >
                    {loading ? <Loading size="small" /> : "Vô hiệu hóa"}
                </button>
            </div>
            <ConfirmModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmDeactivate}
                title="Xác nhận vô hiệu hóa"
                message="Bạn có chắc chắn muốn vô hiệu hóa tài khoản? Hệ thống sẽ đăng xuất bạn ngay lập tức."
                isProcessing={loading}
            />
        </div>
    );
}

export default DeactivateAccount;