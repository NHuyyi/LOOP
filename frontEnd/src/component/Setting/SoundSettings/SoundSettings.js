import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames/bind";
import styles from "./SoundSettings.module.css";
import { getSettingsSounds } from "../../../services/notifications/getNotiSettings";
import { updateSettingsSounds } from "../../../services/notifications/updateNotiSettings";
import { setNotiSettings } from "../../../redux/userSlice";
import { Volume2, VolumeX } from "lucide-react";

const cx = classNames.bind(styles);

function SoundSettings() {
    const settings = useSelector(state => state.user.notificationSettings);
    const dispatch = useDispatch();

    // Local State chỉ dành riêng cho việc kéo thả Slider mượt mà (không đợi API)
    const [localVols, setLocalVols] = useState({ message: 0.8, default: 0.5 });

    useEffect(() => {
        if (!settings) {
            getSettingsSounds().then(res => {
                if (res.success) dispatch(setNotiSettings(res.data));
            });
        } else {
            // Đồng bộ Local State khi Redux Settings tải xong
            setLocalVols({
                message: settings.messageSound?.volume || 0.8,
                default: settings.defaultSound?.volume || 0.5
            });
        }
    }, [dispatch, settings]);

    // Hàm phát âm thanh chuyên biệt
    const playPreview = (soundType, volume) => {
        if (!soundType) return;
        try {
            const soundFile = require(`../../../asset/sounds/${soundType}.mp3`);
            const audio = new Audio(soundFile);
            audio.volume = volume;
            audio.play().catch(() => { });
        } catch (err) {
            console.error("Lỗi phát âm thanh:", soundType);
        }
    };

    if (!settings) return <div>Đang tải cài đặt...</div>;

    const msgSettings = settings.messageSound || {};
    const defSettings = settings.defaultSound || {};

    // 1. TÍNH TOÁN TRẠNG THÁI HỖN HỢP (DERIVED STATE)
    const isSameSound = msgSettings.soundType === defSettings.soundType;
    const isSameVolume = localVols.message === localVols.default;
    const isMasterMuted = !msgSettings.enabled && !defSettings.enabled;

    const displayMasterSound = isSameSound ? msgSettings.soundType : "mixed";
    const displayMasterVolume = isSameVolume ? localVols.message : "mixed";

    // 2. XỬ LÝ THAY ĐỔI LOẠI ÂM THANH (DROPDOWN)
    const handleSoundTypeChange = async (category, value) => {
        let updatedSettings = { ...settings };

        if (category === 'master') {
            updatedSettings.messageSound = { ...msgSettings, soundType: value };
            updatedSettings.defaultSound = { ...defSettings, soundType: value };
        } else {
            updatedSettings[category] = { ...settings[category], soundType: value };
        }

        dispatch(setNotiSettings(updatedSettings));

        // Gọi API
        if (category === 'master') {
            await updateSettingsSounds({
                messageSound: updatedSettings.messageSound,
                defaultSound: updatedSettings.defaultSound
            });
        } else {
            await updateSettingsSounds({ [category]: updatedSettings[category] });
        }

        // Phát nghe thử ngay lập tức
        const playVol = category === 'master' ? localVols.message : localVols[category === 'messageSound' ? 'message' : 'default'];
        playPreview(value, playVol);
    };

    // 3. XỬ LÝ KÉO SLIDER (CHỈ CẬP NHẬT UI TRÊN TAY)
    const handleVolumeDrag = (category, value) => {
        if (category === 'master') {
            // Ngay khi nhích thanh Master, lập tức đồng bộ 2 thanh con
            setLocalVols({ message: value, default: value });
        } else {
            setLocalVols(prev => ({ ...prev, [category === 'messageSound' ? 'message' : 'default']: value }));
        }
    };

    // 4. XỬ LÝ DỪNG KÉO SLIDER (LƯU API & NGHE THỬ)
    const handleVolumeRelease = async (category) => {
        let updatedSettings = { ...settings };
        let playType = '';
        let playVol = 0;

        if (category === 'master') {
            updatedSettings.messageSound = { ...msgSettings, volume: localVols.message };
            updatedSettings.defaultSound = { ...defSettings, volume: localVols.default };
            playType = msgSettings.soundType;
            playVol = localVols.message;
        } else {
            const volKey = category === 'messageSound' ? 'message' : 'default';
            updatedSettings[category] = { ...settings[category], volume: localVols[volKey] };
            playType = settings[category].soundType;
            playVol = localVols[volKey];
        }

        // Cập nhật Redux & API
        dispatch(setNotiSettings(updatedSettings));
        if (category === 'master') {
            await updateSettingsSounds({
                messageSound: updatedSettings.messageSound,
                defaultSound: updatedSettings.defaultSound
            });
        } else {
            await updateSettingsSounds({ [category]: updatedSettings[category] });
        }

        // Phát âm thanh
        playPreview(playType, playVol);
    };

    // 5. XỬ LÝ NÚT MUTE/UNMUTE
    const handleToggleMute = async (category) => {
        let updatedSettings = { ...settings };
        if (category === 'master') {
            const newState = isMasterMuted;
            updatedSettings.messageSound = { ...msgSettings, enabled: newState };
            updatedSettings.defaultSound = { ...defSettings, enabled: newState };
        } else {
            updatedSettings[category] = { ...settings[category], enabled: !settings[category].enabled };
        }

        dispatch(setNotiSettings(updatedSettings));
        if (category === 'master') {
            await updateSettingsSounds(updatedSettings);
        } else {
            await updateSettingsSounds({ [category]: updatedSettings[category] });
        }
    };

    // COMPONENT RENDER TỪNG DÒNG
    const renderRow = (title, category, isMaster = false) => {
        const isMuted = isMaster ? isMasterMuted : !settings[category]?.enabled;
        const currentSound = isMaster ? displayMasterSound : settings[category]?.soundType;
        const currentVol = isMaster ? displayMasterVolume : localVols[category === 'messageSound' ? 'message' : 'default'];

        const isMixedSound = currentSound === "mixed";
        const isMixedVolume = currentVol === "mixed";

        return (
            <div className={cx("sound-row", { master: isMaster })}>
                <div className={cx("label")}>{title}</div>
                <div className={cx("controls")}>
                    <select
                        className={cx("custom-select", { "mixed-state": isMixedSound })}
                        value={currentSound}
                        onChange={(e) => handleSoundTypeChange(category, e.target.value)}
                        disabled={isMuted}
                    >
                        {isMixedSound && <option value="mixed" hidden>--- Nhiều âm thanh ---</option>}
                        <option value="Am_1">Tiếng Pop</option>
                        <option value="Am_2">Tiếng Ding</option>
                        <option value="Am_3">Tiếng Chuông</option>
                    </select>

                    <div className={cx("volume-control")}>
                        <input
                            className={cx("custom-range", { "mixed-state": isMixedVolume })}
                            type="range" min="0.1" max="1" step="0.1"
                            value={isMixedVolume ? 0.5 : currentVol} // Fallback 50% khi đang ở trạng thái Mixed
                            onChange={(e) => handleVolumeDrag(category, parseFloat(e.target.value))}
                            onMouseUp={() => handleVolumeRelease(category)}
                            onTouchEnd={() => handleVolumeRelease(category)}
                            disabled={isMuted}
                        />
                        <span className={cx("vol-text", { "mixed-state": isMixedVolume })}>
                            {isMixedVolume ? "--%" : `${Math.round(currentVol * 100)}%`}
                        </span>
                    </div>

                    <button
                        className={cx("mute-btn", { muted: isMuted })}
                        onClick={() => handleToggleMute(category)}
                        title={isMuted ? "Bật âm" : "Tắt âm"}
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className={cx("container")}>
            <h3 className={cx("title")}>Âm thanh thông báo</h3>
            <p className={cx("subtitle")}>Tuỳ chỉnh âm thanh cho các hoạt động. Bạn có thể nghe thử ngay khi chọn hoặc kéo thanh âm lượng.</p>
            <div className={cx("settings-wrapper")}>
                {renderRow("Âm thanh chung", "master", true)}
                {renderRow("Thông báo tin nhắn", "messageSound")}
                {renderRow("Thông báo chung", "defaultSound")}
            </div>
        </div>
    );
}

export default SoundSettings;