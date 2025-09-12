import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import reactionReducer from "./reactionSlide";
import commentRecuder from "./commentSlide";
import onlineRecuder from "./onlineSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    reactions: reactionReducer,
    comments: commentRecuder,
    online: onlineRecuder,
  },
});
