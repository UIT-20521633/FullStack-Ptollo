import { StatusCodes } from "http-status-codes";
import ms from "ms";
import { userService } from "~/services/userService";
import ApiError from "~/utils/ApiError";

const createNew = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body);
    res.status(StatusCodes.CREATED).json(createdUser);
  } catch (error) {
    next(error);
  }
};
const verifyAccount = async (req, res, next) => {
  try {
    const verifiedUser = await userService.verifyAccount(req.body);
    res.status(StatusCodes.OK).json(verifiedUser);
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const loggedUser = await userService.login(req.body);

    /**
     * Xử lý trả về httpOnly cookie cho FE
     * Đối với cái maxAge - thời gian sống của cookie thì chúng ta sẽ để tối đa là 14 ngày, tùy dự án.
     * Lưu ý: thời gian sống của cookie khác với cái thời gian sống của token
     */
    res.cookie("accessToken", loggedUser.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });
    res.cookie("refreshToken", loggedUser.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });

    res.status(StatusCodes.OK).json(loggedUser);
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    //Xóa cookie - đơn giản là làm ngược lại so với việc gán cookie ở hàm login
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(StatusCodes.OK).json({ loggedOut: true });
  } catch (error) {
    next(error);
  }
};
const refreshToken = async (req, res, next) => {
  try {
    const result = await userService.refreshToken(req.cookies?.refreshToken);

    // Trả về một cái cookie accessToken mới sau khi đã refresh thành công
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(
      new ApiError(
        StatusCodes.FORBIDDEN,
        "Please Sign In! (Error from refresh Token)"
      )
    );
  }
};
const update = async (req, res, next) => {
  try {
    //Do đã chạy qua authorized và token đã được giải mã nên khi ở middleware gửi đi ta có thể lấy userId từ req.jwtDecoded._id
    const userId = req.jwtDecoded._id;
    const userAvatarFile = req.file;
    // console.log(userAvatarFile);
    const updatedUser = await userService.update(
      userId,
      req.body,
      userAvatarFile
    );
    res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
const getStarredBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const starredBoards = await userService.getStarredBoards(userId);
    res.status(StatusCodes.OK).json(starredBoards);
  } catch (error) {
    next(error);
  }
};
const getRecentlyViewedBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const recentlyViewedBoards = await userService.getRecentlyViewedBoards(
      userId
    );
    res.status(StatusCodes.OK).json(recentlyViewedBoards);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  createNew,
  verifyAccount,
  login,
  logout,
  refreshToken,
  update,
  getStarredBoards,
  getRecentlyViewedBoards,
};
