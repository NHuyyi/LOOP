import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import reactionReducer from "./reactionSlide";
import commentRecuder from "./commentSlide";
import onlineRecuder from "./onlineSlice";
import postsReducer from "./postSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
    reactions: reactionReducer,
    comments: commentRecuder,
    online: onlineRecuder,
  },
});
