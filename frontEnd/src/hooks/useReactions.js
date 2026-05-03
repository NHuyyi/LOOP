// Đường dẫn: src/hooks/useReactions.js
import { useMemo } from "react";

export const useReactions = () => {
  // Sử dụng đường dẫn tương đối trỏ thẳng vào thư mục public/images/emojis
  const reactions = useMemo(
    () => [
      { type: "like", icon: "/images/emojis/emoji-like.png" },
      { type: "love", icon: "/images/emojis/emoji-love.png" },
      { type: "haha", icon: "/images/emojis/emoji-haha.png" },
      { type: "wow", icon: "/images/emojis/emoji-wow.png" },
      { type: "sad", icon: "/images/emojis/emoji-sad.png" },
      {
        type: "angry",
        icon: "/images/emojis/emoji-angry.png",
      },
    ],
    [],
  );

  // Hàm hỗ trợ tìm kiếm nhanh thông tin của 1 reaction khi biết type
  const getReactionByType = (type) => {
    return reactions.find((r) => r.type === type) || null;
  };

  return { reactions, getReactionByType };
};
