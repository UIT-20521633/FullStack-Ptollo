/**
 *namnguyen
 */

import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { BOARD_TYPES } from "~/utils/constants";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const createNew = async (req, res, next) => {
  /**
   * Note: Mặc định chúng ta không cần phải custom message ở phía BE làm gì vì để cho FE tự validate và custom message phía FE cho đẹp
   * BE chỉ cần validate đảm bảo dữ liệu chuẩn xác, và trả về message mặc định từ thư viện là được
   * Quan trọng: Việc validate data BẮT BUỘC phải có ở phía BE vì đây là điểm cuối để đưa dữ liệu vào DB
   * Và thông thường trong thực tế, điều tốt nhất cho hệ thống là hãy luôn validate data ở cả phía FE và BE
   */

  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(100).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string()
      .valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE)
      .required(),
  });

  try {
    //nó sẽ kiểm tra xem req.body có đúng với schema mình đã định nghĩa ở correctCondition hay không
    //abortEarly: false: nếu có lỗi thì nó sẽ trả về tất cả các lỗi, không dừng lại ở lỗi đầu tiên
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    //next() nghĩa có phần Validate này đã pass, thì cho request tiếp tục chạy đến controller tiếp theo
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};
const update = async (req, res, next) => {
  //?Không dùng required cho update
  //required ở đây nghĩa là field đó phải có, không thể để trống
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(100).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE),
  });
  try {
    //abortEarly: false: nếu có lỗi thì nó sẽ trả về tất cả các lỗi, không dừng lại ở lỗi đầu tiên
    //allowUnknown: true: cho phép req.body có các field không được định nghĩa ở correctCondition
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};
const moveCardToDifferentColumn = async (req, res, next) => {
  //?Không dùng required cho update
  //required ở đây nghĩa là field đó phải có, không thể để trống
  const correctCondition = Joi.object({
    currentCardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    prevColumnId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    prevCardOrderIds: Joi.array()
      .required()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      ),
    nextColumnId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds: Joi.array()
      .required()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      ),
  });
  try {
    //abortEarly: false: nếu có lỗi thì nó sẽ trả về tất cả các lỗi, không dừng lại ở lỗi đầu tiên
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};
const updateBackground = async (req, res, next) => {
  const correctCondition = Joi.object({
    //Background gửi lên là 1 from data
    background: Joi.string().required(),
  });
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

export const boardValidation = {
  createNew,
  update,
  moveCardToDifferentColumn,
  updateBackground,
};
