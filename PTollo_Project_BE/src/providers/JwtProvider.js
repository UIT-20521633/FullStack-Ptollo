import JWT from "jsonwebtoken";

// * Tạo JWT Token
/**
 * *Function tạo mới token - Cần 3 tham số đầu vào:
 * *userInfo: Những thông tin đính kèm trong token
 * *secretSignature(privateKey): chữ ký bí mật để tạo token(dạng string ngẫu nhiên)
 * *tokenLife: Thời gian sống của token
 */
const generateToken = async (userInfo, privateKey, tokenLife) => {
  try {
    //Hàm sign (hàm ký) của JWT - thuật toán mặc định HS256
    return JWT.sign(userInfo, privateKey, {
      algorithm: "HS256",
      expiresIn: tokenLife,
    });
  } catch (error) {
    throw new Error(error);
  }
};
// * Xác thực JWT Token
/**
 * *Function kiểm tra 1 token có hợp lệ hay không
 * *Hợp lệ ở đây hiểu là cái token đc tạo ra có đúng với cái chữ ký bí mật secretSignature hay không
 */
const verifyToken = async (token, privateKey) => {
  try {
    //
    return JWT.verify(token, privateKey);
  } catch (error) {
    throw new Error(error);
  }
};

export const JwtProvider = {
  generateToken,
  verifyToken,
};
