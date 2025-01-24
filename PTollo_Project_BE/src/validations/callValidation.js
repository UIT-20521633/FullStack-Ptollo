import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { OBJECT_ID_RULE } from "~/utils/validators";

const renewToken = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message("Invalid User ID"),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message));
  }
};

const createRoom = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message("Invalid User ID"),
    userName: Joi.string().required(),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message));
  }
};
const joinRoom = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message("Invalid User ID"),
    roomId: Joi.string()
      .required()
      .min(15)
      .max(100)
      .message("Invalid Room ID")
      .trim()
      .strict(),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message));
  }
};
const sendRoom = async (req, res, next) => {
  const correctCondition = Joi.object({
    roomId: Joi.string()
      .required()
      .min(15)
      .max(100)
      .message("Invalid Room ID")
      .trim()
      .strict(),
    listUserRoom: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE)),
    boardId: Joi.string().required(),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message));
  }
};

export const callValidation = {
  createRoom,
  joinRoom,
  renewToken,
  sendRoom,
};
