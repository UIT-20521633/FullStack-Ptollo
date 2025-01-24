/* eslint-disable no-useless-catch */
import { StatusCodes } from "http-status-codes";
import { userModel } from "~/models/userModel";
import ApiError from "~/utils/ApiError";
import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { pickUser } from "~/utils/formatters";
import { WEBSITE_DOMAIN } from "~/utils/constants";
import { BrevoProvider } from "~/providers/BrevoProvider";
import { env } from "~/config/environment";
import { JwtProvider } from "~/providers/JwtProvider";
import { CloudinaryProvider } from "~/providers/CloudinaryProvider";
import { boardModel } from "~/models/boardModel";

const createNew = async (reqBody) => {
  try {
    //Kiểm tra xem email đã tồn tại chưa
    const existedUser = await userModel.findOneByEmail(reqBody.email);
    if (existedUser) {
      throw new ApiError(StatusCodes.CONFLICT, "Email already exists!");
    }
    //Tạo data mới để lưu vào db
    //nameFromEmail là tên mà chúng ta lấy từ email ví dụ: email là namnguyen@gmail.com thì nameFromEmail sẽ là namnguyen
    const nameFromEmail = reqBody.email.split("@")[0];
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 10), //Tham số thứ 2 của hàm hash là số vòng lặp để mã hóa password càng lớn thì càng an toàn nhưng cũng càng tốn thời gian
      username: nameFromEmail,
      displayName: nameFromEmail, //mặc định giống với username khi user đăng ký mới, sau này user có thể tự đổi
      verifyToken: uuidv4(), //Tạo token xác thực tài khoản ngẫu nhiên
    };
    //Thực hiện lưu data vào db
    const createdUser = await userModel.createNew(newUser);
    const getNewUser = await userModel.findOneById(createdUser.insertedId);
    //gửi email xác thực tài khoản
    const verifycationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`;
    const customSubject =
      "Ptollo - Project Management Tool: Please verify your email before using our service!";
    const htmlContent = `
        <h3>Dear ${getNewUser.displayName},</h3>
        <h3>Here is your verification link:</h3>
        <h3>${verifycationLink}</h3>
        <h3>Thank you for choosing us!</h3>
        <h3>Best regards,</h3>
        <h3>Ptollo Team</h3>
        `;
    //Gọi tới provider để gửi email
    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent);
    //return trả về data cho controller
    return pickUser(getNewUser);
  } catch (error) {
    throw error;
  }
};
const verifyAccount = async (reqBody) => {
  try {
    //Query tìm user theo email
    const existUser = await userModel.findOneByEmail(reqBody.email);

    //Các bước kiểm tra cần thiết
    if (!existUser)
      throw new ApiError(StatusCodes.NOT_FOUND, "Account not found!");
    if (existUser.isActive)
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is already active!"
      );
    if (existUser.verifyToken !== reqBody.token)
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Token is incorrect!");

    //Nếu tất cả các bước kiểm tra đều qua thì tiến hành update thông tin user để verify tài khoản
    const updateData = {
      isActive: true,
      verifyToken: null,
    };
    //Thực hiện update thông tin user
    const updatedUser = await userModel.update(existUser._id, updateData);

    //return trả về data cho controller
    return pickUser(updatedUser);
  } catch (error) {
    throw error;
  }
};

const login = async (reqBody) => {
  try {
    //Query tìm user theo email
    const existUser = await userModel.findOneByEmail(reqBody.email);

    //Các bước kiểm tra cần thiết
    if (!existUser)
      throw new ApiError(StatusCodes.NOT_FOUND, "Account not found!");
    if (!existUser.isActive)
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is not active! Please verify your email!"
      );
    if (!bcryptjs.compareSync(reqBody.password, existUser.password))
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Your Email or Password is incorrect!"
      );
    // Nếu mọi thứ ok thì bắt đầu tạo token cho user để trả về cho FE
    //Tạo thông tin để đính kèm trong JWT Token bao gồm: _id, email của user
    const userInfo = {
      _id: existUser._id,
      email: existUser.email,
    };

    //Tạo ra 2 loại token: access token và refresh token để tránh việc lộ thông tin khi token bị đánh cắp và sử dụng trả về cho FE
    //Access Token: sử dụng để xác thực user, thời gian sống ngắn, thường là 15-30 phút
    //Access Token sẽ được trả về cho FE và lưu vào localStorage hoặc sessionStorage
    //Refresh Token: sử dụng để tạo ra access token mới, thời gian sống dài hơn access token, thường là 7 ngày hoặc 30 ngày
    //Refresh Token sẽ được lưu vào cookie của trình duyệt với thuộc tính httpOnly: true để tránh bị đánh cắp thông tin
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_PRIVATE_KEY,
      env.ACCESS_TOKEN_LIFE
    );
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_PRIVATE_KEY,
      env.REFRESH_TOKEN_LIFE
    );

    //Trả về thông tin user kèm theo 2 cái token vừa tạo cho FE
    return { accessToken, refreshToken, ...pickUser(existUser) };
  } catch (error) {
    throw error;
  }
};
const refreshToken = async (clientRefreshToken) => {
  try {
    // Bước 01: Thực hiện giải mã refreshToken xem nó có hợp lệ hay là không
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_PRIVATE_KEY
    );

    // Đoạn này vì chúng ta chỉ lưu những thông tin unique và cố định của user trong token rồi, vì vậy có thể lấy luôn từ decoded ra, tiết kiệm query vào DB để lấy data mới.
    //Vì khi giải mã refreshToken từ FE thì ta thu được _id và email của user, từ đó có thể tạo accessToken mới mà không cần phải query vào DB lấy thông tin user mới nữa (tiết kiệm thời gian)
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email,
    };

    // Bước 02: Tạo ra cái accessToken mới
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_PRIVATE_KEY,
      // 5 // 5 giây
      env.ACCESS_TOKEN_LIFE
    );

    return { accessToken };
  } catch (error) {
    throw error;
  }
};
const update = async (userId, reqBody, userAvatarFile) => {
  try {
    //Query user và kiểm tra xem user có tồn tại không cho chắc chắn
    const existUser = await userModel.findOneById(userId);
    if (!existUser)
      throw new ApiError(StatusCodes.NOT_FOUND, "Account not found!");
    if (!existUser.isActive)
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is not active!"
      );
    //Khởi tạo kết quả update User ban đầu là empty
    let updatedUser = {};

    //Trường hợp change password
    if (reqBody.current_password && reqBody.new_password) {
      //Kiểm tra current_password có đúng không
      if (!bcryptjs.compareSync(reqBody.current_password, existUser.password))
        throw new ApiError(
          StatusCodes.NOT_ACCEPTABLE,
          "Current Password is incorrect!"
        );
      //Nếu như current_password đúng thì tiến hành hash new_password và update vào db
      updatedUser = await userModel.update(userId, {
        password: bcryptjs.hashSync(reqBody.new_password, 10),
      });
    } else if (userAvatarFile) {
      //Trường hợp upload file lên Cloud Storage, cụ thể là Cloudinary
      const uploadedResult = await CloudinaryProvider.streamUpload(
        userAvatarFile.buffer,
        "user_avatar"
      );
      //Lưu lại url (secure_url) của file ảnh vào db
      updatedUser = await userModel.update(userId, {
        avatar: uploadedResult.secure_url,
      });
    } else {
      //Trường hợp update thông tin chung, ví dụ như displayName, avatar, ...
      updatedUser = await userModel.update(userId, reqBody);
    }

    //return trả về data cho controller
    return pickUser(updatedUser);
  } catch (error) {
    throw error;
  }
};
const getStarredBoards = async (userId) => {
  try {
    //Query tìm user theo userId
    const existUser = await userModel.findOneById(userId);
    //Kiểm tra xem user có tồn tại không
    if (!existUser)
      throw new ApiError(StatusCodes.NOT_FOUND, "Account not found!");
    // Khởi tạo `starredBoards nếu chưa tồn tại
    if (!existUser.starredBoards) {
      existUser.starredBoards = [];
    }
    // Fetch details for all boards in `starredBoards`
    const detailedStarredBoards = await Promise.all(
      existUser.starredBoards.map(async (starredBoard) => {
        const boardDetails = await boardModel.findOneById(starredBoard.boardId);
        return {
          ...starredBoard,
          board: boardDetails,
        };
      })
    );
    // Trả về kết quả với recentlyViewed bà kèm theo board
    return {
      starredBoards: detailedStarredBoards,
    };
  } catch (error) {
    throw error;
  }
};
const getRecentlyViewedBoards = async (userId) => {
  try {
    //Query tìm user theo userId
    const existUser = await userModel.findOneById(userId);
    //Kiểm tra xem user có tồn tại không
    if (!existUser)
      throw new ApiError(StatusCodes.NOT_FOUND, "Account not found!");
    // Khởi tạo `recentlyViewed nếu chưa tồn tại
    if (!existUser.recentlyViewed) {
      existUser.recentlyViewed = [];
    }
    // Fetch details for all boards in `recentlyViewed`
    const detailedRecentlyViewedBoards = await Promise.all(
      existUser.recentlyViewed.map(async (recentlyViewedBoard) => {
        const boardDetails = await boardModel.findOneById(
          recentlyViewedBoard.boardId
        );
        return {
          ...recentlyViewedBoard,
          board: boardDetails,
        };
      })
    );
    // Trả về kết quả với recentlyViewed bà kèm theo board
    return {
      recentlyViewedBoards: detailedRecentlyViewedBoards,
    };
  } catch (error) {
    throw error;
  }
};
export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  update,
  getStarredBoards,
  getRecentlyViewedBoards,
};
