/* eslint-disable no-useless-catch */
import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { userModel } from "~/models/userModel";
import { ObjectId } from "mongodb";
import { boardModel } from "./boardModel";

// Define Collection (name & schema)
const MESSAGE_COLLECTION_NAME = "messages";
const MESSAGE_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE), // id của board
  senderId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE), // người gửi
  receiverId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE), // người nhận
  text: Joi.string(), // nội dung tin nhắn
  image: Joi.string().allow(null).default(null), // ảnh đính kèm (nếu có)
  createdAt: Joi.date().timestamp("javascript").default(Date.now), // thời gian gửi
});

// Fields that are not allowed to be updated
// Fields that are not allowed to be updated
const INVALID_UPDATE_FIELDS = [
  "_id",
  "boardId",
  "senderId",
  "receiverId",
  "createdAt",
];

// Validate message schema before creation
const validateBeforeCreate = async (data) => {
  return await MESSAGE_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

// Validate senderId and receiverId references
const validateReferences = async (senderId, receiverId, boardId) => {
  const boardIdExists = await GET_DB()
    .collection(boardModel.BOARD_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(boardId) });
  const senderExists = await GET_DB()
    .collection(userModel.USER_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(senderId) });
  const receiverExists = await GET_DB()
    .collection(userModel.USER_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(receiverId) });

  if (!senderExists || !receiverExists || !boardIdExists) {
    throw new Error("SenderId, receiverId or boardId does not exist");
  }
};

// Find messages by senderId and receiverId
const findMessagesFromSenderAndReceiverId = async (
  myId,
  userToChatId,
  boardId
) => {
  try {
    // Retrieve messages where senderId and receiverId match the criteria
    return await GET_DB()
      .collection(MESSAGE_COLLECTION_NAME)
      .find({
        boardId: boardId, // Lọc theo boardId để tránh lấy nhầm tin nhắn của các board khác nhau
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      })
      .toArray();
  } catch (error) {
    throw error;
  }
};

// Send a message after validating schema and references
const sendMessage = async (newMessage) => {
  try {
    const validatedMessage = await validateBeforeCreate(newMessage);
    await validateReferences(
      validatedMessage.senderId,
      validatedMessage.receiverId,
      validatedMessage.boardId
    );

    const result = await GET_DB()
      .collection(MESSAGE_COLLECTION_NAME)
      .insertOne(validatedMessage);
    return result;
  } catch (error) {
    throw error;
  }
};

export const messagesModel = {
  MESSAGE_COLLECTION_NAME,
  MESSAGE_COLLECTION_SCHEMA,
  findMessagesFromSenderAndReceiverId,
  sendMessage,
};
