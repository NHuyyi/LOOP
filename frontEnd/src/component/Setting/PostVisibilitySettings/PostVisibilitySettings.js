import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames/bind";
import styles from "./PostVisibilitySettings.module.css";
import { updatePrivacyAPI } from "../../../services/User/updatePrivacyAPI";
import { setUser } from "../../../redux/userSlice";

import CustomVisibilityModal from "../../post/CustomVisibility/CustomVisibility";

const cx = classNames.bind(styles);

function PostVisibilitySettings() {
    const { user, token } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [visibility, setVisibility] = useState(user?.defaultPostVisibility || "friends");
    const [showCustomModal, setShowCustomModal] = useState(false);

    // Khi chọn Friends hoặc Private
    const handleChange = async (newVal) => {
        setVisibility(newVal);
        const res = await updatePrivacyAPI({
            defaultPostVisibility: newVal,
            defaultDenyList: [] // Reset danh sách chặn nếu đổi về Friends/Private
        });

        if (res.success) {
            dispatch(setUser({ user: res.user, token }));
        } else {
            setVisibility(user?.defaultPostVisibility || "friends");
            alert(res.message);
        }
    };

    // Khi chọn lưu danh sách từ Modal Custom
    const handleSaveCustom = async (denyList) => {
        if (denyList.length === 0) {
            handleChange("friends"); // Nếu không chọn ai thì mặc định quay về friends
            return;
        }

        setVisibility("custom");
        const res = await updatePrivacyAPI({
            defaultPostVisibility: "custom",
            defaultDenyList: denyList
        });

        if (res.success) {
            dispatch(setUser({ user: res.user, token }));
        } else {
            setVisibility(user?.defaultPostVisibility || "friends");
            alert(res.message);
        }
    };

    return (
        <div className={cx("container")}>
            <h3 className={cx("title")}>Quyền riêng tư bài viết mặc định</h3>
            <p className={cx("description")}>
                Chọn đối tượng mặc định có thể xem các bài viết mới của bạn.
            </p>

            <div className={cx("radio-group")}>
                <label className={cx("radio-item", { selected: visibility === "friends" })}>
                    <input
                        type="radio"
                        name="defaultVisibility"
                        value="friends"
                        className={cx("radio-input")}
                        checked={visibility === "friends"}
                        onChange={() => handleChange("friends")}
                    />
                    <div className={cx("radio-label")}>
                        <h4>Bạn bè</h4>
                        <p>Chỉ bạn bè mới có thể thấy bài viết.</p>
                    </div>
                </label>

                <label className={cx("radio-item", { selected: visibility === "private" })}>
                    <input
                        type="radio"
                        name="defaultVisibility"
                        value="private"
                        className={cx("radio-input")}
                        checked={visibility === "private"}
                        onChange={() => handleChange("private")}
                    />
                    <div className={cx("radio-label")}>
                        <h4>Chỉ mình tôi</h4>
                        <p>Đăng dưới dạng nhật ký cá nhân.</p>
                    </div>
                </label>

                <label className={cx("radio-item", { selected: visibility === "custom" })}>
                    <input
                        type="radio"
                        name="defaultVisibility"
                        value="custom"
                        className={cx("radio-input")}
                        checked={visibility === "custom"}
                        // Chỉ cần click là mở Modal
                        onChange={() => setShowCustomModal(true)}
                    />
                    <div className={cx("radio-label")}>
                        <h4>Bạn bè ngoại trừ...</h4>
                        <p>Không hiển thị với một số người bạn chọn.</p>
                    </div>
                </label>
            </div>

            {/* Hiển thị Modal chọn danh sách chặn */}
            {showCustomModal && (
                <CustomVisibilityModal
                    initialSelected={user?.defaultDenyList || []}
                    friendList={user?.friends || []}
                    onClose={() => setShowCustomModal(false)}
                    onSave={(list) => {
                        handleSaveCustom(list);
                        setShowCustomModal(false);
                    }}
                />
            )}
        </div>
    );
}

export default PostVisibilitySettings;