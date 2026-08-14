import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./SettingsPage.module.css";
import SettingsSidebar from "../../component/Setting/SettingsSidebar/SettingsSidebar";
import SettingsContent from "../../component/Setting/SettingsContent/SettingsContent";

const cx = classNames.bind(styles);

function SettingsPage() {
    const [activeTab, setActiveTab] = useState("edit_basic_info");

    return (
        <div className={cx("settings-container")}>
            <div className={cx("settings-wrapper")}>
                <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <SettingsContent activeTab={activeTab} />
            </div>
        </div>
    );
}
export default SettingsPage;