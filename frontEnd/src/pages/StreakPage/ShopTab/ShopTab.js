import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames/bind";
import styles from "./ShopTab.module.css";
import { getShopItems } from "../../../services/shop/getShopItems";
import { buySticker } from "../../../services/shop/buySticker";
import { useToast } from "../../../context/ToastContext";
import { setUser } from "../../../redux/userSlice";
import Loading from "../../../component/Loading/Loading";

const cx = classNames.bind(styles);

function ShopTab() {
    const [stickers, setStickers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const { user, token } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const toast = useToast();

    const ownedStickers = user?.ownedStickers || [];

    // Lấy danh sách Sticker từ Backend
    useEffect(() => {
        const fetchStickers = async () => {
            setLoading(true);
            const res = await getShopItems();
            if (res.success) {
                setStickers(res.stickers || []);
            } else {
                toast.error(res.message || "Không thể tải danh sách cửa hàng");
            }
            setLoading(false);
        };
        fetchStickers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Xử lý mua Sticker
    const handleBuy = async (sticker) => {
        if (user?.coins < sticker.price) {
            toast.error("Ngân khố của bạn không đủ để mua vật phẩm này!");
            return;
        }

        setProcessingId(sticker._id);
        const res = await buySticker(sticker._id);
        setProcessingId(null);

        if (res.success) {
            toast.success("Mua Sticker thành công!");

            // Cập nhật lại User trong Redux (Trừ tiền, thêm sticker)
            const updatedUser = {
                ...user,
                coins: res.coins, // Backend trả về coins mới
                ownedStickers: [...ownedStickers, sticker._id]
            };

            dispatch(setUser({ user: updatedUser, token }));
        } else {
            toast.error(res.message || "Lỗi khi mua hàng");
        }
    };

    if (loading) {
        return (
            <section className={cx("section")}>
                <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                    <Loading size="medium" text="Đang tải cửa hàng..." />
                </div>
            </section>
        );
    }

    return (
        <section className={cx("section")}>
            <div className={cx("sectionHeader")}>
                <div className={cx("titleGroup")}>
                    <h2 className={cx("title")}>🛒 Cửa Hàng Sticker</h2>
                    <p className={cx("desc")}>Dùng Ngân khố của bạn để đổi các sticker độc đáo</p>
                </div>

                <div className={cx("balanceBadge")}>
                    <span className={cx("coinIcon")}>💰</span>
                    <span className={cx("coinValue")}>{user?.coins?.toLocaleString() || 0} Ngân khố</span>
                </div>
            </div>

            <div className={cx("grid")}>
                {stickers.length > 0 ? (
                    stickers.map((sticker) => {
                        const isOwned = ownedStickers.includes(sticker._id);
                        const isProcessing = processingId === sticker._id;

                        return (
                            <div key={sticker._id} className={cx("card")}>
                                <div className={cx("imageWrapper")}>
                                    <img src={sticker.imageUrl} alt={sticker.name} className={cx("image")} />
                                </div>

                                <div className={cx("info")}>
                                    <h3 className={cx("itemName")}>{sticker.name}</h3>
                                    <p className={cx("itemDesc")}>{sticker.description}</p>
                                </div>

                                <div className={cx("actionArea")}>
                                    <span className={cx("price")}>
                                        {sticker.price.toLocaleString()} 💰
                                    </span>

                                    {isOwned ? (
                                        <button className={cx("buyBtn", "ownedBtn")} disabled>
                                            Đã sở hữu
                                        </button>
                                    ) : (
                                        <button
                                            className={cx("buyBtn")}
                                            disabled={isProcessing || user?.coins < sticker.price}
                                            onClick={() => handleBuy(sticker)}
                                        >
                                            {isProcessing ? <Loading size="small" /> : "Mua ngay"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className={cx("emptyText")}>Cửa hàng hiện chưa có mặt hàng nào.</p>
                )}
            </div>
        </section>
    );
}

export default ShopTab;