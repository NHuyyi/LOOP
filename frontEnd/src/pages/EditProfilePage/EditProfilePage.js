import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./EditProfilePage.module.css";
import BasicInfoForm from "../../component/EditProfile/BasicInfoForm/BasicInfoForm";
import ChangePasswordForm from "../../component/EditProfile/ChangePasswordForm/ChangePasswordForm";

const cx = classNames.bind(styles);

function EditProfilePage() {
    const [activeTab, setActiveTab] = useState("basic"); // 'basic' | 'password'

    return (
        <div className={cx("page-container")}>
            <div className={cx("wrapper")}>
                <div className={cx("sidebar")}>
                    <h2 className={cx("page-title")}>Cài đặt</h2>
                    <ul className={cx("menu-list")}>
                        <li
                            className={cx("menu-item", { active: activeTab === "basic" })}
                            onClick={() => setActiveTab("basic")}
                        >
                            Thông tin cơ bản
                        </li>
                        <li
                            className={cx("menu-item", { active: activeTab === "password" })}
                            onClick={() => setActiveTab("password")}
                        >
                            Đổi mật khẩu
                        </li>
                    </ul>
                </div>

                <div className={cx("content")}>
                    {activeTab === "basic" && <BasicInfoForm />}
                    {activeTab === "password" && <ChangePasswordForm />}
                </div>
            </div>
        </div>
    );
}

export default EditProfilePage;