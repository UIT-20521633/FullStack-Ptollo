import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { verifyUserAPI } from "~/apis";
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner";

const AccountVerification = () => {
  //Lấy giá trị email và token từ url
  let [searchParams] = useSearchParams();
  //   let email = searchParams.get("email");
  //   let token = searchParams.get("token");
  const { email, token } = Object.fromEntries([...searchParams]);

  //Tạo 1 biển state để biết đã verify tài khoản thành công hay chưa
  const [verified, setVerified] = useState(false);

  //Gọi API verify tài khoản
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token })
        .then(() => {
          setVerified(true);
        })
        .catch(() => {
          setVerified(false);
        });
    }
  }, []);
  verifyUserAPI;
  //Nếu url có vấn đề,không tồn tại 1 trong 2 giá trị email hoặc token thì đá sang trang 404
  if (!email || !token) {
    return <Navigate to="/404" />;
  }
  //Nếu chưa verify thì hiển thị loading
  if (!verified) {
    return <PageLoadingSpinner caption="Verifying your account" />;
  }
  // Cuối cùng nếu không gặp vấn đề gì + với verify thành công thì điều hướng về trang login cùng giá trị verifiedEmail
  return <Navigate to={`/login?verifiedEmail=${email}`} />;
};
export default AccountVerification;
