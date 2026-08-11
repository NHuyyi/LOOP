import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import styles from "./BasicInfoForm.module.css";
import { setUser } from "../../../redux/userSlice";
import { updateProfile } from "../../../services/User/updateProfile";
import uploadImage from "../../../services/Post/uploadImage";
import Loading from "../../Loading/Loading";
import { Camera } from "lucide-react";

const cx = classNames.bind(styles);

function BasicInfoForm() {
    const { user, token } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    // States cho text
    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState(user?.profile?.bio || "");
    const [location, setLocation] = useState(user?.profile?.location || "");
    const [gender, setGender] = useState(user?.profile?.gender || "Bí mật");
    const [dateOfBirth, setDateOfBirth] = useState(
        user?.profile?.dateOfBirth ? user.profile.dateOfBirth.split('T')[0] : ""
    );

    // States cho Images (File upload và Preview)
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(
        user?.avatar || "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
    );
    const [coverPreview, setCoverPreview] = useState(
        user?.profile?.coverPhoto || "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
    );

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(null);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setFadeOut(true), 2500);
            const removeTimer = setTimeout(() => {
                setMessage("");
                setFadeOut(false);
            }, 3000);
            return () => {
                clearTimeout(timer);
                clearTimeout(removeTimer);
            };
        }
    }, [message]);

    // Handle Image Selection
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file)); // Hiển thị tạm thời
        }
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file)); // Hiển thị tạm thời
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let avatarUrl = user?.avatar;
            let coverUrl = user?.profile?.coverPhoto;

            // 1. Upload Avatar nếu có file mới
            if (avatarFile) {
                const avatarRes = await uploadImage(avatarFile, "LOOP_AVATAR");
                avatarUrl = avatarRes.data.url;
            }

            // 2. Upload Cover nếu có file mới
            if (coverFile) {
                const coverRes = await uploadImage(coverFile, "LOOP_COVER");
                coverUrl = coverRes.data.url;
            }

            // 3. Gom tất cả state lại
            const profileData = {
                name,
                avatar: avatarUrl,
                coverPhoto: coverUrl,
                bio,
                location,
                gender,
                dateOfBirth
            };

            // 4. Gọi service cập nhật DB
            const data = await updateProfile(profileData);

            if (data.success) {
                dispatch(setUser({ user: data.user, token }));
                setMessage("Cập nhật thông tin thành công!");
                setSuccess(true);
            } else {
                setMessage(data.message || "Cập nhật thất bại");
                setSuccess(false);
            }
        } catch (error) {
            setMessage("Lỗi kết nối máy chủ");
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx("form-container")}>
            <h3 className={cx("title")}>Thông tin cơ bản</h3>

            <form onSubmit={handleSubmit}>
                {/* --- KHU VỰC ẢNH BÌA VÀ AVATAR --- */}
                <div className={cx("images-container")}>
                    {/* Ảnh bìa */}
                    <div className={cx("cover-wrapper")}>
                        <img src={coverPreview} alt="Cover" className={cx("cover-img")} />
                        <label htmlFor="cover-upload" className={cx("change-cover-btn")}>
                            <Camera size={16} className="me-1" /> Đổi ảnh bìa
                        </label>
                        <input id="cover-upload" type="file" accept="image/*" className={cx("hidden-input")} onChange={handleCoverChange} />
                    </div>

                    {/* Ảnh đại diện */}
                    <div className={cx("avatar-wrapper")}>
                        <img src={avatarPreview} alt="Avatar" className={cx("avatar-img")} />
                        <label htmlFor="avatar-upload" className={cx("change-avatar-btn")}>
                            <Camera size={16} />
                        </label>
                        <input id="avatar-upload" type="file" accept="image/*" className={cx("hidden-input")} onChange={handleAvatarChange} />
                    </div>
                </div>

                {/* --- KHU VỰC THÔNG TIN TEXT --- */}
                <div className={cx("input-group")}>
                    <label className={cx("form-label")}>Tên hiển thị</label>
                    <div className={cx("border-input")}>
                        <input type="text" className={cx("custom-input")} value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                </div>

                <div className={cx("input-group")}>
                    <label className={cx("form-label")}>Tiểu sử (Bio)</label>
                    <div className={cx("border-input")}>
                        <textarea className={cx("custom-input")} value={bio} onChange={(e) => setBio(e.target.value)} rows="3" placeholder="Vài dòng giới thiệu bản thân..." style={{ resize: "none" }} />
                    </div>
                </div>

                <div className={cx("input-group")}>
                    <label className={cx("form-label")}>Nơi sống</label>
                    <div className={cx("border-input")}>
                        <input type="text" className={cx("custom-input")} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="VD: TP. Hồ Chí Minh" />
                    </div>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                    <div className={cx("input-group")} style={{ flex: 1 }}>
                        <label className={cx("form-label")}>Giới tính</label>
                        <div className={cx("border-input")}>
                            <select className={cx("custom-input")} value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                                <option value="Bí mật">Bí mật</option>
                            </select>
                        </div>
                    </div>

                    <div className={cx("input-group")} style={{ flex: 1 }}>
                        <label className={cx("form-label")}>Ngày sinh</label>
                        <div className={cx("border-input")}>
                            <input type="date" className={cx("custom-input")} value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                        </div>
                    </div>
                </div>

                <button type="submit" className={cx("app-btn", "submit-btn")} disabled={loading}>
                    {loading ? <Loading size="small" /> : "Lưu thay đổi"}
                </button>
            </form>

            {message && (
                <div
                    className={`${cx("app-message")} ${success ? cx("app-message__ok") : cx("app-message__err")
                        } ${fadeOut ? cx("fade-out") : ""}`}
                >
                    {message}
                </div>
            )}
        </div>
    );
}

export default BasicInfoForm;