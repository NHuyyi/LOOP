// Đường dẫn: src/hooks/useReactions.js
import { useMemo } from "react";

export const useReactions = () => {
  // Bọc đường dẫn vào trong require() để Webpack nạp ảnh
  const reactions = useMemo(
    () => [
      { type: "like", icon: require("../asset/images/emojis/emoji-like.png") },
      { type: "love", icon: require("../asset/images/emojis/emoji-love.png") },
      { type: "haha", icon: require("../asset/images/emojis/emoji-haha.png") },
      { type: "wow", icon: require("../asset/images/emojis/emoji-wow.png") },
      { type: "sad", icon: require("../asset/images/emojis/emoji-sad.png") },
      {
        type: "angry",
        icon: require("../asset/images/emojis/emoji-angry.png"),
      },
    ],
    [],
  );

  // This function allows you to get a reaction object by its type, returning null if not found
  const getReactionByType = (type) => {
    return reactions.find((r) => r.type === type) || null;
  };

  return { reactions, getReactionByType };
};
