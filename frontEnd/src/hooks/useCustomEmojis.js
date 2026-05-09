import { useMemo } from "react";

export const useCustomEmojis = () => {
  const emojis = useMemo(() => {
    // This value is the result of require.context, which gives us a function to load files and an array of file names
    const context = require.context("../asset/images/emojis", false, /\.png$/);

    const loadedEmojis = context.keys().map((fileName) => {
      const imagePath = context(fileName);
      // Extract the type from the file name, e.g., "./myicon1.png" -> "myicon1"
      const type = fileName.replace("./", "").replace(".png", "");

      return {
        type,
        icon: imagePath,
      };
    });
    return loadedEmojis;
  }, []);
  return { emojis };
};
