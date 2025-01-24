import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

// Define Collection (name & schema)
const ROOM_COLLECTION_NAME = "rooms";
const ROOM_COLLECTION_SCHEMA = Joi.object({
  roomId: Joi.string().required(), // ID của phòng (roomID)
  userId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE), // Người tạo phòng (userID)
  userName: Joi.string().required(), // Tên người tạo phòng
  token: Joi.string().required(), // Token để join vào phòng
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

// Chỉ định ra những Fields mà chúng ta không muốn cho phép cập nhật trong hàm update()
const INVALID_UPDATE_FIELDS = ["_id", "userId", "userName", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await ROOM_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createRoom = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    // Biến đổi một số dữ liệu liên quan tới ObjectId chuẩn chỉnh
    let newRoomToAdd = {
      ...validData,
      userId: new ObjectId(validData.userId),
    };
    // Gọi insert vào DB
    const createdRoom = await GET_DB()
      .collection(ROOM_COLLECTION_NAME)
      .insertOne(newRoomToAdd);
    return createdRoom;
  } catch (error) {
    throw new Error(error);
  }
};

const findByRoomId = async (roomId) => {
  try {
    const result = await GET_DB()
      .collection(ROOM_COLLECTION_NAME)
      .findOne({ roomId: roomId });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const callModel = {
  ROOM_COLLECTION_NAME,
  ROOM_COLLECTION_SCHEMA,
  createRoom,
  findByRoomId,
};
