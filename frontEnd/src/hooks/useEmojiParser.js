import React, { useCallback } from "react";

export const useEmojiParser = () => {
  // Thêm tham số options (mặc định là một object rỗng)
  const parseEmojis = useCallback((text, conversation) => {
    if (!text) return null;

    // Rút trích các tuỳ chọn người dùng truyền vào (Nếu không truyền thì dùng mặc định)
    // - isJumboEnabled: Bật tính năng siêu to khổng lồ (Mặc định: false)
    // - normalSize: Kích thước icon mặc định (Mặc định: "26px")

    const textWithoutSpaces = text.replace(/\s+/g, "");
    const isOnlyEmojis =
      textWithoutSpaces.length > 0 &&
      /^(\[emoji-[a-zA-Z0-9_-]+\])+$/.test(textWithoutSpaces);

    // KẾT LUẬN KÍCH THƯỚC: Nếu được phép Jumbo VÀ chỉ có icon thì 48px, ngược lại lấy normalSize
    let emojiSize = "26px";
    let emojimagin = "0 2px";
    if (!conversation && isOnlyEmojis) {
      emojiSize = "48px";
      emojimagin = "0 4px";
    }

    const regex = /(\[emoji-[a-zA-Z0-9_-]+\])/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        const emojiName = part.slice(1, -1);
        try {
          const imageSrc = require(`../asset/images/emojis/${emojiName}.png`);
          return (
            <img
              key={index}
              src={imageSrc}
              alt={emojiName}
              style={{
                width: emojiSize,
                height: emojiSize,
                verticalAlign: "middle",
                margin: emojimagin,
              }}
            />
          );
        } catch (err) {
          return <span key={index}>{part}</span>;
        }
      }

      if (part === "\n") {
        return <br key={index} />;
      }

      return <span key={index}>{part}</span>;
    });
  }, []);

  return { parseEmojis };
};
