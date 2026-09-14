import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notifications",
    initialState: {
        items: [],
        unreadCount: 0,
    },
    reducers: {
        setNotifications: (state, action) => {
            state.items = action.payload;
            state.unreadCount = action.payload.filter(n => !n.isRead).length;

            console.log("dữ liệu nhận được", state.items);
        },
        addNotification: (state, action) => {
            state.items.unshift(action.payload);
            state.unreadCount += 1;
        },
        markSingleAsRead: (state, action) => {
            const noti = state.items.find(n => n._id === action.payload);
            if (noti && !noti.isRead) {
                noti.isRead = true;
                // Giảm số đếm nhưng không để bị âm
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        }
    }
});

export const { setNotifications, addNotification, markSingleAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;