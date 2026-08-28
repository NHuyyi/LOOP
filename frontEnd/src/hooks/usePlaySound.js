import { useCallback, useRef } from "react";

export const usePlaySound = () => {
    // Dùng ref để lưu trữ đối tượng Audio đang phát
    const currentAudioRef = useRef(null);

    const playSound = useCallback((soundType, volume = 0.8) => {
        if (!soundType || soundType === "mixed") return;

        try {
            // 1. Nếu có âm thanh đang phát, phải dừng nó lại ngay lập tức
            if (currentAudioRef.current) {
                currentAudioRef.current.pause();
                currentAudioRef.current.currentTime = 0;
            }

            // 2. Khởi tạo âm thanh mới
            const soundFile = require(`../asset/sounds/${soundType}.mp3`);
            const audio = new Audio(soundFile);

            // Đảm bảo không cho phép lặp vô tận
            audio.loop = false;
            audio.volume = volume;

            // 3. Cập nhật ref để quản lý cho lần phát tiếp theo
            currentAudioRef.current = audio;

            // 4. Phát âm thanh
            audio.play().catch((err) => {
                console.log("Trình duyệt chặn autoplay:", err);
            });
        } catch (err) {
            console.error(`Không tìm thấy file âm thanh: ${soundType}.mp3`, err);
        }
    }, []);

    return { playSound };
};