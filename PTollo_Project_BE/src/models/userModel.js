import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from "~/utils/validators";

// Define tạm 2 roles cho user, tùy việc mở rộng dự án như thế nào mà mọi người có thể thêm role tùy ý sao cho phù hợp sau.
const USER_ROLES = {
  CLIENT: "client",
  ADMIN: "admin",
};

// Define Collection (name & schema)
const USER_COLLECTION_NAME = "users";
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string()
    .required()
    .pattern(EMAIL_RULE)
    .message(EMAIL_RULE_MESSAGE), // unique
  password: Joi.string().required(),
  // username cắt ra từ email sẽ có khả năng không unique bởi vì sẽ có những tên email trùng nhau nhưng từ các nhà cung cấp khác nhau
  username: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  avatar: Joi.string().default(null),
  role: Joi.string()
    .valid(...Object.values(USER_ROLES))
    .default(USER_ROLES.CLIENT),

  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),

  recentlyViewed: Joi.array()
    .items(
      Joi.object({
        boardId: Joi.string().required(),
        lastViewed: Joi.date()
          .timestamp("javascript")
          .default(Date.now)
          .required(),
      })
    )
    .default([]),
  starredBoards: Joi.array()
    .items(
      Joi.object({
        boardId: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
      })
    )
    .default([]),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

// Chỉ định ra những Fields mà chúng ta không muốn cho phép cập nhật trong hàm update()
const INVALID_UPDATE_FIELDS = ["_id", "email", "username", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const createdUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(validData);
    return createdUser;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(userId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneByEmail = async (emailValue) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ email: emailValue });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (userId, updateData) => {
  try {
    // Lọc những field mà chúng ta không cho phép cập nhật linh tinh
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updateData },
        { returnDocument: "after" } // sẽ trả về kết quả mới sau khi cập nhật
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
//Filler toàn bộ user khác trừ user hiện tại
const filterUsersNeUserId = async (userId) => {
  try {
    // Lấy thông tin user từ DB
    //$ne: not equal (không bằng) lấy ra những user có _id khác với userId
    const users = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .find(
        { _id: { $ne: new ObjectId(userId) } },
        { projection: { password: 0 } }
      )
      .toArray();
    return users;
  } catch (error) {
    throw new Error(error);
  }
};

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  USER_ROLES,
  createNew,
  findOneById,
  findOneByEmail,
  update,
  filterUsersNeUserId,
};
