import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import DashBoard from "./components/DashBoard/DashBoard";
import { NAVIGATION_MAIN, NAVIGATION_USER } from "~/config/navigation";
import BoardPage from "./pages/Boards/_id";
import HomePage from "./pages/Home/HomePage";
import NotFound from "./pages/404/NotFound";
import Auth from "./pages/Auth/Auth";
import AccountVerification from "./pages/Auth/AccountVerification";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "~/redux/user/userSlice";
import Settings from "~/pages/Settings/Settings";
import { useEffect, useState } from "react";
import Boards from "./pages/Boards";
import CallPage from "./pages/CallPage/CallPage";
import TemplateDetail from "./pages/TemplatesP/TemplateDetail";
import Landingpage from "./pages/LandingPage/Landingpage";
import TemplatesPage from "./pages/TemplatesP/TemplatesPage";

/**
 * Giải pháp Clean Code trong việc xác định các route nào cần đăng nhập tài khoản xong thì mới cho truy cập
 * Sử dụng <Outlet /> của react-router-dom để hiển thị các Child Route (xem cách sử dụng trong App() bên dưới)
 * https://reactrouter.com/en/main/components/outlet
 * Một bài hướng dẫn khá đầy đủ:
 * https://www.robinwieruch.de/react-router-private-routes/
 */
const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/landingpage" replace={true} />;
  }
  //Nếu đã đăng nhập thì chuyển hướng vào outlet là nhưng route con của route này (được bọc bởi route này)
  return <Outlet />;
};

function AppRoutes() {
  const currentUser = useSelector(selectCurrentUser);
  const location = useLocation(); // get the current location

  // Kiểm tra xem đường dẫn hiện tại có phải là /settings hay không
  const [isSettingsPage, setIsSettingsPage] = useState(false);
  useEffect(() => {
    // Kiểm tra xem đường dẫn có phải là /settings không
    if (
      location.pathname.startsWith("/settings") ||
      location.pathname.startsWith("/call")
    ) {
      // Nếu là /settings thì set isSettingsPage thành true để ẩn thanh nav
      setIsSettingsPage(true);
    } else {
      // Nếu không phải thì set lại thành false để hiển thị thanh nav
      setIsSettingsPage(false);
    }
  }, [location.pathname]); // Chạy lại mỗi khi pathname thay đổi
  return (
    <Routes>
      <Route path="/landingpage" element={<Landingpage />} />
      {/* Redirect Route */}
      {/* Protected Routes: Hiểu là trong dự án chúng ta là những route chỉ cho truy cập sau khi đã login */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* Outlet của react-router-dom giúp chúng ta render ra những route con trong này */}
        <Route path="/" element={<DashBoard hideNav={isSettingsPage} />}>
          {/* Trang mặc định */}
          {/* <Route index element={<DashBoardPage />} /> */}
          <Route
            index
            element={
              //Ở đây cần replace={true} để thay thế route /, có thể hiểu là route / sẽ không nằm trong history Browser
              //Thực hành dễ hiểu hơn bằng cách nhấn Go Home từ trang 404 xong thử quay lại bằng nút back của trình duyệt giữa 2 trường hợp replace={true} và không
              <Navigate to="/boards" replace={true} />
            }
          />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/templates/:id" element={<TemplateDetail />} />
          <Route path="/home" element={<HomePage />} />
          {/* Board Detail */}
          <Route path="/boards/:boardId" element={<BoardPage />} />
          <Route path="/boards" element={<Boards />} />
          {/* User Setting */}
          <Route path="/settings/account" element={<Settings />} />
          <Route path="/settings/security" element={<Settings />} />
          {/* Call  */}
          <Route path="/call/:roomId" element={<CallPage />} />
        </Route>
      </Route>
      {/* Authentication */}
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />

      {/* 404 not found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
