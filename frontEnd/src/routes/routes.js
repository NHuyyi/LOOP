import SignUpPage from "../pages/SignUpPage/SignUpPage";
import Otp from "../pages/verifyOTPPage/verifyOTPPage";
import Forget from "../pages/forgetpasspage/forgetpasspage";
import Reset from "../pages/resetpasspage/resetpasspage";
import Home from "../pages/HomePage/HomePage";
import Friends from "../pages/friendpage/friendspage";
import Chat from "../pages/chat/chatpage";
import FriendProfilePage from "../pages/FriendProfilePage/FriendProfilePage";
import StreakPage from "../pages/StreakPage/StreakPage";
import MyProfilePage from "../pages/MyProfilePage/MyProfilePage";
import EditProfilePage from "../pages/EditProfilePage/EditProfilePage";
import SettingsPage from "../pages/SettingsPage/SettingsPage";
import PostPage from "../pages/PostPage/PostPage";
import AdminPage from "../pages/AdminPage/AdminPage";
const routes = [
  {
    path: "/",
    Element: <SignUpPage />,
    isHeader: false,
  },

  {
    path: "otp",
    Element: <Otp />,
    isHeader: false,
  },
  {
    path: "forget-password",
    Element: <Forget />,
    isHeader: false,
  },
  {
    path: "reset-password",
    Element: <Reset />,
    isHeader: false,
  },
  {
    path: "home",
    Element: <Home />,
    isHeader: true,
  },
  {
    path: "friends",
    Element: <Friends />,
    isHeader: true,
  },
  {
    path: "chat",
    Element: <Chat />,
    isHeader: true,
  },
  {
    path: "streak",
    Element: <StreakPage />,
    isHeader: true,
  },

  {
    path: "friend/:id",
    Element: <FriendProfilePage />,
    isHeader: true, // Hiển thị kèm Header (thanh điều hướng)
  },

  {
    path: "profile",
    Element: <MyProfilePage />,
    isHeader: true,
  },

  {
    path: "edit-profile",
    Element: <EditProfilePage />,
    isHeader: true,
  },
  {
    path: "settings",
    Element: <SettingsPage />,
    isHeader: true,
  },
  {
    path: "post/:id",
    Element: <PostPage />,
    isHeader: true, // Hiển thị Header
  },
  {
    path: "admin/*",
    Element: <AdminPage />,
    isHeader: false, // Đặt false nếu bạn định làm Sidebar/Header riêng cho Admin
  },
];

export default routes;
