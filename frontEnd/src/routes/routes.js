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
];

export default routes;
