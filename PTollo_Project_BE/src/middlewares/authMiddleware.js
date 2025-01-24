import { StatusCodes } from "http-status-codes";
import { JwtProvider } from "~/providers/JwtProvider";
import { env } from "~/config/environment";
import ApiError from "~/utils/ApiError";

// Middleware này sẽ đảm nhiệm việc quan trọng: Xác thực cái JWT accessToken nhận được từ phía FE có hợp lệ hay không
const isAuthorized = async (req, res, next) => {
  //Lấy accessToken nằm trong request cookie phía client - withCredentials trong file authorizeAxios
  const clientAccessToken = req.cookies?.accessToken;
  //Nếu không có accessToken thì trả về lỗi luôn
  if (!clientAccessToken) {
    //next() với một instance của ApiError sẽ được xử lý bởi middleware errorHandlingMiddleware
    next(
      new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized! Token not found")
    );
  }
  try {
    // Bước 01: Thực hiện giải mã token xem nó có hợp lệ hay là không
    const accessTokenDecoded = await JwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_PRIVATE_KEY
    );
    // Bước 02: Quan trọng: Nếu như cái token hợp lệ, thì sẽ cần phải lưu thông tin giải mã được vào cái req.jwtDecoded, để sử dụng cho các tầng cần xử lý ở phía sau
    req.jwtDecoded = accessTokenDecoded; // Lưu thông tin giải mã được từ accessToken vào req.jwtDecoded
    // Bước 03: Cho phép cái request đi tiếp
    next();
  } catch (error) {
    //Nếu cái accessToken bị hết hạn (expired) thì sẽ trả về lỗi GONE - 410 để FE biết để gọi api refresh token
    if (error?.message?.includes("jwt expired")) {
      next(
        new ApiError(StatusCodes.GONE, "Token expired! Need to refresh token")
      );
      return;
    }
    //Nếu accessToken không hợp lệ do bất kì điều gì khác (trừ hết hạn) thì trả về lỗi 401 cho FE và gọi api signout luôn
    next(new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized!"));
  }
};

export const authMiddleware = {
  isAuthorized,
};
