import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames/bind";
import styles from "./SoundSettings.module.css";
import { updateSettingsSounds } from "../../../services/notifications/updateNotiSettings";
import { setNotiSettings } from "../../../redux/userSlice";
import { Volume2, VolumeX, ChevronDown, ChevronUp, MessageCircle, Bell } from "lucide-react";
import { usePlaySound } from "../../../hooks/usePlaySound";

const cx = classNames.bind(styles);

function SoundSettings() {
    const settings = useSelector(state => state.user.notificationSettings);
    const dispatch = useDispatch();
    const { playSound } = usePlaySound();

    // Tự động quét file mp3 trong asset/sounds
    const availableSounds = useMemo(() => {
        try {
            const soundContext = require.context('../../../asset/sounds', false, /\.mp3$/);
            return soundContext.keys().map(fileName =>
                fileName.replace('./', '').replace('.mp3', '')
            );
        } catch (error) {
            console.error("Không thể đọc thư mục âm thanh:", error);
            return ["Am_1", "Am_2", "Am_3"];
        }
    }, []);

    const [openGroups, setOpenGroups] = useState({
        messages: false,
        others: false
    });

    const [localVols, setLocalVols] = useState({
        messageSound: 0.8,
        defaultSound: 0.5,
        postSound: 0.8,
        typingSound: 0.3,
        messageStatusSound: 0.5
    });

    useEffect(() => {
        if (settings) {
            setLocalVols({
                messageSound: settings.messageSound?.volume ?? 0.8,
                defaultSound: settings.defaultSound?.volume ?? 0.5,
                postSound: settings.postSound?.volume ?? 0.8,
                typingSound: settings.typingSound?.volume ?? 0.3,
                messageStatusSound: settings.messageStatusSound?.volume ?? 0.5
            });
        }
    }, [settings]);


    if (!settings) return <div>Đang tải cài đặt...</div>;

    const msgSettings = settings.messageSound || {};
    const defSettings = settings.defaultSound || {};
    const postSettings = settings.postSound || {};
    const typingSettings = settings.typingSound || {};
    const statusSettings = settings.messageStatusSound || {};

    const isSameSound = msgSettings.soundType === defSettings.soundType &&
        defSettings.soundType === postSettings.soundType &&
        postSettings.soundType === typingSettings.soundType &&
        typingSettings.soundType === statusSettings.soundType;

    const isSameVolume = localVols.messageSound === localVols.defaultSound &&
        localVols.defaultSound === localVols.postSound &&
        localVols.postSound === localVols.typingSound &&
        localVols.typingSound === localVols.messageStatusSound;

    const isMasterMuted = !msgSettings.enabled && !defSettings.enabled &&
        !postSettings.enabled && !typingSettings.enabled &&
        !statusSettings.enabled;

    const displayMasterSound = isSameSound ? msgSettings.soundType : "mixed";
    const displayMasterVolume = isSameVolume ? localVols.messageSound : "mixed";

    const handleSoundTypeChange = async (category, value) => {
        let updatedSettings = { ...settings };
        if (category === 'master') {
            updatedSettings.messageSound = { ...msgSettings, soundType: value };
            updatedSettings.defaultSound = { ...defSettings, soundType: value };
            updatedSettings.postSound = { ...postSettings, soundType: value };
            updatedSettings.typingSound = { ...typingSettings, soundType: value };
            updatedSettings.messageStatusSound = { ...statusSettings, soundType: value };
        } else {
            updatedSettings[category] = { ...settings[category], soundType: value };
        }
        dispatch(setNotiSettings(updatedSettings));

        await updateSettingsSounds(category === 'master' ? updatedSettings : { [category]: updatedSettings[category] });

        const playVol = category === 'master' ? localVols.messageSound : localVols[category];
        playSound(value, playVol);
    };

    const handleVolumeDrag = (category, value) => {
        if (category === 'master') {
            setLocalVols({ messageSound: value, defaultSound: value, postSound: value, typingSound: value, messageStatusSound: value });
        } else {
            setLocalVols(prev => ({ ...prev, [category]: value }));
        }
    };

    const handleVolumeRelease = async (category) => {
        let updatedSettings = { ...settings };
        let playType = '';
        let playVol = 0;

        if (category === 'master') {
            updatedSettings.messageSound = { ...msgSettings, volume: localVols.messageSound };
            updatedSettings.defaultSound = { ...defSettings, volume: localVols.defaultSound };
            updatedSettings.postSound = { ...postSettings, volume: localVols.postSound };
            updatedSettings.typingSound = { ...typingSettings, volume: localVols.typingSound };
            updatedSettings.messageStatusSound = { ...statusSettings, volume: localVols.messageStatusSound };
            playType = msgSettings.soundType;
            playVol = localVols.messageSound;
        } else {
            updatedSettings[category] = { ...settings[category], volume: localVols[category] };
            playType = settings[category].soundType;
            playVol = localVols[category];
        }

        dispatch(setNotiSettings(updatedSettings));
        await updateSettingsSounds(category === 'master' ? updatedSettings : { [category]: updatedSettings[category] });
        playSound(playType, playVol);
    };

    const handleToggleMute = async (category) => {
        let updatedSettings = { ...settings };
        if (category === 'master') {
            const newState = isMasterMuted;
            updatedSettings.messageSound = { ...msgSettings, enabled: newState };
            updatedSettings.defaultSound = { ...defSettings, enabled: newState };
            updatedSettings.postSound = { ...postSettings, enabled: newState };
            updatedSettings.typingSound = { ...typingSettings, enabled: newState };
            updatedSettings.messageStatusSound = { ...statusSettings, enabled: newState };
        } else {
            updatedSettings[category] = { ...settings[category], enabled: !settings[category].enabled };
        }
        dispatch(setNotiSettings(updatedSettings));
        await updateSettingsSounds(category === 'master' ? updatedSettings : { [category]: updatedSettings[category] });
    };

    const toggleGroup = (groupName) => {
        setOpenGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
    };

    const renderRow = (title, category, isMaster = false) => {
        const isMuted = isMaster ? isMasterMuted : !settings[category]?.enabled;
        const currentSound = isMaster ? displayMasterSound : settings[category]?.soundType;
        const currentVol = isMaster ? displayMasterVolume : localVols[category];
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
                        {/* Chỉ render thẳng tên file ra đây */}
                        {availableSounds.map((soundName) => (
                            <option key={soundName} value={soundName}>
                                {soundName}
                            </option>
                        ))}
                    </select>

                    <div className={cx("volume-control")}>
                        <input
                            className={cx("custom-range", { "mixed-state": isMixedVolume })}
                            type="range" min="0.1" max="1" step="0.1"
                            value={isMixedVolume ? 0.5 : currentVol}
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
            <p className={cx("subtitle")}>Tùy chỉnh âm thanh cho các hoạt động. Bạn có thể nghe thử ngay khi chọn hoặc kéo thanh âm lượng.</p>

            <div className={cx("settings-wrapper")}>
                <div className={cx("master-section")}>
                    {renderRow("Âm thanh chung (Master)", "master", true)}
                </div>

                <div className={cx("setting-group")}>
                    <div className={cx("group-header")} onClick={() => toggleGroup('messages')}>
                        <div className={cx("group-title")}>
                            <MessageCircle size={20} />
                            <span>Nhóm Tin nhắn</span>
                        </div>
                        {openGroups.messages ? <ChevronUp size={20} className={cx("chevron")} /> : <ChevronDown size={20} className={cx("chevron")} />}
                    </div>

                    {openGroups.messages && (
                        <div className={cx("group-content")}>
                            {renderRow("Tin nhắn mới", "messageSound")}
                            {renderRow("Trạng thái tin nhắn", "messageStatusSound")}
                            {renderRow("Trạng thái nhập", "typingSound")}
                        </div>
                    )}
                </div>

                <div className={cx("setting-group")}>
                    <div className={cx("group-header")} onClick={() => toggleGroup('others')}>
                        <div className={cx("group-title")}>
                            <Bell size={20} />
                            <span>Hoạt động khác</span>
                        </div>
                        {openGroups.others ? <ChevronUp size={20} className={cx("chevron")} /> : <ChevronDown size={20} className={cx("chevron")} />}
                    </div>

                    {openGroups.others && (
                        <div className={cx("group-content")}>
                            {renderRow("Đăng bài", "postSound")}
                            {renderRow("Thông báo hệ thống", "defaultSound")}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SoundSettings;