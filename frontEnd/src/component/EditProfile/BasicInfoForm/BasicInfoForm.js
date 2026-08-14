import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
    useEffect(() => {
        if (user) {
            const profile = (user.profile && typeof user.profile === "object") ? user.profile : {};

            setName(user.name || "");
            setBio(profile.bio || "");
            setGender(profile.gender || "Bí mật");
            setPhoneNumber(profile.phoneNumber || "");
            setLocation(profile.location || "");
            setOccupation(profile.occupation || "");
            setWorkplace(profile.workplace || "");
            setEducation(profile.education || "");
            setHobbies(profile.hobbies ? profile.hobbies.join(", ") : "");

            if (profile.dateOfBirth) {
                const d = new Date(profile.dateOfBirth);
                setDobDay(d.getDate().toString());
                setDobMonth((d.getMonth() + 1).toString());
                setDobYear(d.getFullYear().toString());
            }

            const socials = profile.socialLinks || [];
            const getLink = (platform) => socials.find(link => link.platform === platform)?.url || "";
            setFacebookLink(getLink("Facebook"));
            setGithubLink(getLink("Github"));

            setAvatarPreview(user.avatar || "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png");
            setCoverPreview(profile.coverPhoto || "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png");
        }
    }, [user]);
    const safeProfile = (user?.profile && typeof user.profile === "object") ? user.profile : {};

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState(safeProfile.bio || "");
    const [gender, setGender] = useState(safeProfile.gender || "Bí mật");
    const [phoneNumber, setPhoneNumber] = useState(safeProfile.phoneNumber || "");
    const [location, setLocation] = useState(safeProfile.location || "");
    const [occupation, setOccupation] = useState(safeProfile.occupation || "");
    const [workplace, setWorkplace] = useState(safeProfile.workplace || "");
    const [education, setEducation] = useState(safeProfile.education || "");
    const [hobbies, setHobbies] = useState(safeProfile.hobbies ? safeProfile.hobbies.join(", ") : "");

    // Logic xử lý 3 ô Ngày / Tháng / Năm độc lập
    const getInitialDob = () => {
        if (!safeProfile.dateOfBirth) return { day: "", month: "", year: "" };
        const d = new Date(safeProfile.dateOfBirth);
        return {
            day: d.getDate().toString(),
            month: (d.getMonth() + 1).toString(),
            year: d.getFullYear().toString()
        };
    };
    const initialDob = getInitialDob();
    const [dobDay, setDobDay] = useState(initialDob.day);
    const [dobMonth, setDobMonth] = useState(initialDob.month);
    const [dobYear, setDobYear] = useState(initialDob.year);

    const daysInSelectedMonth = (!dobMonth) ? 31 : new Date(dobYear || new Date().getFullYear(), parseInt(dobMonth), 0).getDate();

    const initialSocials = safeProfile.socialLinks || [];
    const getSocialLink = (platform) => initialSocials.find(link => link.platform === platform)?.url || "";
    const [facebookLink, setFacebookLink] = useState(getSocialLink("Facebook"));
    const [githubLink, setGithubLink] = useState(getSocialLink("Github"));

    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(
        user?.avatar || "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
    );
    const [coverPreview, setCoverPreview] = useState(
        safeProfile.coverPhoto || "https://res.cloudinary.com/dpym64zg9/image/upload/v1755614090/raw_cq4nqn.png"
    );

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(null);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        if (message && !success) {
            const timer = setTimeout(() => setFadeOut(true), 2500);
            const removeTimer = setTimeout(() => {
                setMessage("");
                setFadeOut(false);
            }, 3000);
            return () => { clearTimeout(timer); clearTimeout(removeTimer); };
        }
    }, [message, success]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra định dạng số điện thoại
        if (phoneNumber) {
            const isNumeric = /^\d+$/.test(phoneNumber);
            const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
            if (!isNumeric || phoneNumber.length !== 10 || !phoneRegex.test(phoneNumber)) {
                setMessage("Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 số.");
                setSuccess(false);
                return;
            }
        }

        let formattedDob = null;
        if (dobYear && dobMonth && dobDay) {
            formattedDob = `${dobYear}-${String(dobMonth).padStart(2, '0')}-${String(dobDay).padStart(2, '0')}`;
        }

        setLoading(true);
        try {
            let avatarUrl = user?.avatar;
            let coverUrl = safeProfile.coverPhoto;

            if (avatarFile) {
                const avatarRes = await uploadImage(avatarFile, "LOOP_AVATAR");
                avatarUrl = avatarRes.data.url;
            }
            if (coverFile) {
                const coverRes = await uploadImage(coverFile, "LOOP_COVER");
                coverUrl = coverRes.data.url;
            }

            const socialLinks = [];
            if (facebookLink.trim()) socialLinks.push({ platform: "Facebook", url: facebookLink.trim() });
            if (githubLink.trim()) socialLinks.push({ platform: "Github", url: githubLink.trim() });

            const hobbiesArray = hobbies.split(",").map(item => item.trim()).filter(item => item !== "");

            const profileData = {
                name, avatar: avatarUrl, coverPhoto: coverUrl, bio, gender, dateOfBirth: formattedDob,
                phoneNumber, location, occupation, workplace, education, hobbies: hobbiesArray, socialLinks
            };

            const data = await updateProfile(profileData);
            if (data.success) {
                dispatch(setUser({ user: data.user, token }));
                setSuccess(true);

                navigate("/profile")
            } else {
                setMessage(data.message || "Cập nhật thất bại");
                setSuccess(false);
                setLoading(false);
            }
        } catch (error) {
            setMessage("Lỗi máy chủ");
            setSuccess(false);
            setLoading(false);
        }
    };

    return (
        <div className={cx("form-container")}>
            <h3 className={cx("title")}>Thông tin cá nhân</h3>

            <form onSubmit={handleSubmit}>
                <fieldset disabled={loading || success} style={{ border: "none", padding: 0, margin: 0 }}>

                    <div className={cx("images-container")}>
                        <div className={cx("cover-wrapper")}>
                            <img src={coverPreview} alt="Cover" className={cx("cover-img")} />
                            <label htmlFor="cover-upload" className={cx("change-cover-btn")}>
                                <Camera size={16} className="me-1" /> Ảnh bìa
                            </label>
                            <input id="cover-upload" type="file" accept="image/*" className={cx("hidden-input")} onChange={handleCoverChange} />
                        </div>
                        <div className={cx("avatar-wrapper")}>
                            <img src={avatarPreview} alt="Avatar" className={cx("avatar-img")} />
                            <label htmlFor="avatar-upload" className={cx("change-avatar-btn")}>
                                <Camera size={16} />
                            </label>
                            <input id="avatar-upload" type="file" accept="image/*" className={cx("hidden-input")} onChange={handleAvatarChange} />
                        </div>
                    </div>

                    <div className={cx("input-group")}>
                        <label className={cx("form-label")}>Tên hiển thị</label>
                        <div className={cx("border-input")}>
                            <input type="text" className={cx("custom-input")} value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                    </div>

                    <div className={cx("input-group")}>
                        <label className={cx("form-label")}>Tiểu sử (Bio)</label>
                        <div className={cx("border-input")}>
                            <textarea className={cx("custom-input")} value={bio} onChange={(e) => setBio(e.target.value)} rows="2" placeholder="Vài dòng giới thiệu..." style={{ resize: "none" }} />
                        </div>
                    </div>

                    {/* NGÀY SINH & GIỚI TÍNH */}
                    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
                        <div className={cx("input-group")} style={{ flex: 1.5, marginBottom: "1.5rem" }}>
                            <label className={cx("form-label")}>Ngày sinh</label>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <div className={cx("border-input")} style={{ flex: 1 }}>
                                    <select className={cx("custom-input")} style={{ padding: "0.75rem 0.5rem" }} value={dobDay} onChange={(e) => setDobDay(e.target.value)}>
                                        <option value="">Ngày</option>
                                        {[...Array(daysInSelectedMonth)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={cx("border-input")} style={{ flex: 1 }}>
                                    <select className={cx("custom-input")} style={{ padding: "0.75rem 0.5rem" }} value={dobMonth} onChange={(e) => setDobMonth(e.target.value)}>
                                        <option value="">Tháng</option>
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>Thg {i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={cx("border-input")} style={{ flex: 1.2 }}>
                                    <input
                                        type="number"
                                        className={cx("custom-input", "no-spinners")}
                                        style={{ padding: "0.75rem 0.5rem" }}
                                        placeholder="Năm"
                                        value={dobYear}
                                        onChange={(e) => setDobYear(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

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
                    </div>

                    {/* SỐ ĐIỆN THOẠI & NƠI SỐNG */}
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className={cx("input-group")} style={{ flex: 1 }}>
                            <label className={cx("form-label")}>Số điện thoại</label>
                            <div className={cx("border-input")}>
                                <input
                                    type="tel"
                                    className={cx("custom-input")}
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="VD: 0912345678"
                                    maxLength="10"
                                />
                            </div>
                        </div>
                        <div className={cx("input-group")} style={{ flex: 1 }}>
                            <label className={cx("form-label")}>Nơi sống</label>
                            <div className={cx("border-input")}>
                                <input
                                    type="text"
                                    className={cx("custom-input")}
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="VD: TP. Hồ Chí Minh"
                                />
                            </div>
                        </div>
                    </div>

                    {/* NGHỀ NGHIỆP & LÀM VIỆC TẠI */}
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className={cx("input-group")} style={{ flex: 1 }}>
                            <label className={cx("form-label")}>Nghề nghiệp</label>
                            <div className={cx("border-input")}>
                                <input
                                    type="text"
                                    className={cx("custom-input")}
                                    value={occupation}
                                    onChange={(e) => setOccupation(e.target.value)}
                                    placeholder="VD: Lập trình viên..."
                                />
                            </div>
                        </div>
                        <div className={cx("input-group")} style={{ flex: 1 }}>
                            <label className={cx("form-label")}>Làm việc / Học tập tại</label>
                            <div className={cx("border-input")}>
                                <input
                                    type="text"
                                    className={cx("custom-input")}
                                    value={workplace}
                                    onChange={(e) => setWorkplace(e.target.value)}
                                    placeholder="VD: FPT Software..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* HỌC VẤN & SỞ THÍCH */}
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className={cx("input-group")} style={{ flex: 1 }}>
                            <label className={cx("form-label")}>Trường học</label>
                            <div className={cx("border-input")}>
                                <input type="text" className={cx("custom-input")} value={education} onChange={(e) => setEducation(e.target.value)} placeholder="VD: Đại học FPT..." />
                            </div>
                        </div>
                        <div className={cx("input-group")} style={{ flex: 1 }}>
                            <label className={cx("form-label")}>Sở thích (Cách nhau dấu phẩy)</label>
                            <div className={cx("border-input")}>
                                <input type="text" className={cx("custom-input")} value={hobbies} onChange={(e) => setHobbies(e.target.value)} placeholder="VD: Chơi game, Nghe nhạc..." />
                            </div>
                        </div>
                    </div>

                    {/* MẠNG XÃ HỘI */}
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div className={cx("input-group")} style={{ flex: 1 }}>
                            <label className={cx("form-label")}>Facebook Link</label>
                            <div className={cx("border-input")}>
                                <input type="url" className={cx("custom-input")} value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} placeholder="https://facebook.com/..." />
                            </div>
                        </div>
                        <div className={cx("input-group")} style={{ flex: 1 }}>
                            <label className={cx("form-label")}>Github Link</label>
                            <div className={cx("border-input")}>
                                <input type="url" className={cx("custom-input")} value={githubLink} onChange={(e) => setGithubLink(e.target.value)} placeholder="https://github.com/..." />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className={cx("app-btn", "submit-btn")}>
                        {loading ? <Loading size="small" /> : "Lưu thay đổi"}
                    </button>
                </fieldset>
            </form>

            {message && (
                <div className={`${cx("app-message")} ${success ? cx("app-message__ok") : cx("app-message__err")} ${fadeOut ? cx("fade-out") : ""}`}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default BasicInfoForm;