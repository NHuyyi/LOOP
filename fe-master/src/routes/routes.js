import SignUpPage from "../pages/SignUpPage/SignUpPage";
import Otp from "../pages/verifyOTPPage/verifyOTPPage";
import Forget from "../pages/forgetpasspage/forgetpasspage";
import Reset from "../pages/resetpasspage/resetpasspage";
import Home from "../pages/HomePage/HomePage";
import Friends from "../pages/friendpage/friendspage";

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
];

export default routes;
