import { useLocation, Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "~/redux/user/userSlice";
import backgroundImage from "../../../src/assets/img/Landingpage_img/background.jpg";
function Auth() {
  const location = useLocation();
  //location.pathname: lấy ra đường dẫn hiện tại
  // console.log(location)
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/signup";

  const currentUser = useSelector(selectCurrentUser);
  //Nếu đã đăng nhập thì chuyển hướng về trang chủ
  if (currentUser) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "flex-start",
        background: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.2)",
      }}>
      {isLogin && <LoginForm />}
      {isRegister && <RegisterForm />}
    </Box>
  );
}

export default Auth;
