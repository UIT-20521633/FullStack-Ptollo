import Joi from "joi";
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} from "~/utils/validators";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { CARD_MEMBER_ACTIONS } from "~/utils/constants";

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = "cards";
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().default(null).optional().allow(null),
  cover: Joi.string().default(null).optional().allow(null),
  attachments: Joi.array().items().default([]),
  memberIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  // Dữ liệu comments của Card chúng ta sẽ học cách nhúng - embedded vào bản ghi Card luôn như dưới đây:
  comments: Joi.array()
    .items({
      userId: Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      userEmail: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
      userAvatar: Joi.string(),
      userDisplayName: Joi.string(),
      content: Joi.string(),
      // Chỗ này lưu ý vì dùng hàm $push để thêm comment nên không set default Date.now luôn giống hàm insertOne khi create được.
      commentedAt: Joi.date().timestamp(),
    })
    .default([]),
  deadline: Joi.date().timestamp("javascript").default(null),
  reminderTime: Joi.date().timestamp("javascript").default(null),
  isComplete: Joi.boolean().default(false),
  userCreateDealineId: Joi.string()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE)
    .default(null),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});
const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};
//chỉ ra các field(trường) không được phép cập nhật trong hàm update
const INVALIB_UPDATE_FIELDS = ["_id", "boardId", "createdAt"];

const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data);
    //validatedData sẽ chứa dữ liệu đã được validate từ Joi và có thêm các giá trị default
    //Biển đổi boardId và columnId từ string sang ObjectId để lưu vào collection
    const newCardToAdd = {
      ...validatedData,
      boardId: new ObjectId(validatedData.boardId),
      columnId: new ObjectId(validatedData.columnId),
    };
    // Thêm dữ liệu vào collection bằng hàm insertOne
    return await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .insertOne(newCardToAdd);
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (cardId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(cardId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const update = async (cardId, updateData) => {
  try {
    //Lọc ra các field không được phép update
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALIB_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });
    //Đối với những những dữ liệu cần update như ObjectId thì cần phải chuyển từ string sang ObjectId
    if (updateData.columnId) {
      updateData.columnId = new ObjectId(updateData.columnId);
    }
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(cardId),
        },
        { $set: updateData },
        //Trả về dữ liệu sau khi đã update, mặc định nếu không có thì sẽ trả về dữ liệu trước khi update dù đã update thành công
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const deleteManyByColumnId = async (columnId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteMany({
        columnId: new ObjectId(columnId),
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const pushAttachments = async (cardId, attachments) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $push: { attachments: { $each: attachments } } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
/**
 * Đẩy một phần tử comment vào đầu mảng comments!
 * - Trong JS, ngược lại với push (thêm phần tử vào cuối mảng) sẽ là unshift (thêm phần tử vào đầu mảng)
 * - Nhưng trong mongodb hiện tại chỉ có $push - mặc định đẩy phần tử vào cuối mảng.
 * Dĩ nhiên cứ lưu comment mới vào cuối mảng cũng được, nhưng đây là để thêm phần tử vào đẩu mảng trong mongodb.
 * Vẫn dùng $push, nhưng bọc data vào Array để trong $each và chỉ định $position: 0
 * https://stackoverflow.com/a/25732817/8324172
 * https://www.mongodb.com/docs/manual/reference/operator/update/position/
 */
const unshiftNewComment = async (cardId, commentData) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        //$each: dùng để bọc dữ liệu vào mảng, $position: 0 để đẩy vào đầu mảng comments của card
        // $each: [commentData] là 1 mảng chứa 1 phần tử commentData để đẩy vào mang comments của card với vị trí thêm là đầu mảng
        { $push: { comments: { $each: [commentData], $position: 0 } } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
/**
 * Hàm này sẽ có nhiệm vụ xử lý cập nhật thêm hoặc xóa member khỏi card dựa theo Action
 * sẽ dùng $push để thêm hoặc $pull để loại bỏ ($pull trong mongodb để lấy một phần tử ra khỏi mảng rồi xóa nó đi)
 */
const updateMembers = async (cardId, incomingMemberInfo) => {
  try {
    // Tạo ra một biến updateCondition ban đầu là rỗng
    let updateCondition = {};
    if (incomingMemberInfo.action === CARD_MEMBER_ACTIONS.ADD) {
      // console.log('Trường hợp Add, dùng $push: ', incomingMemberInfo)
      updateCondition = {
        $push: { memberIds: new ObjectId(incomingMemberInfo.userId) },
      };
    }

    if (incomingMemberInfo.action === CARD_MEMBER_ACTIONS.REMOVE) {
      // console.log('Trường hợp Remove, dùng $pull: ', incomingMemberInfo)
      updateCondition = {
        $pull: { memberIds: new ObjectId(incomingMemberInfo.userId) },
      };
    }

    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        updateCondition, // truyền cái updateCondition ở đây ($push: { memberIds: new ObjectId(incomingMemberInfo.userId) }, hoặc $pull: { memberIds: new ObjectId(incomingMemberInfo.userId) })
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const createDeadlineInCard = async (cardId, deadlineData) => {
  try {
    const { deadline, reminderTime, userCreateDealineId } = deadlineData;
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        {
          $set: {
            deadline: new Date(deadline),
            reminderTime: new Date(reminderTime),
            userCreateDealineId: new ObjectId(userCreateDealineId),
          },
        },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const deleteAttachment = async (cardId, publicId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        // $pull trong mongodb để lấy một phần tử ra khỏi mảng rồi xóa nó đi
        { $pull: { attachments: { publicId } } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const renameAttachment = async (
  cardId,
  newName,
  fileExtension,
  publicId,
  newPublicId
) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId), "attachments.publicId": publicId },
        {
          $set: {
            "attachments.$.fileName": `${newName}.${fileExtension}`,
            "attachments.$.publicId": newPublicId,
            "attachments.$.url": `https://res.cloudinary.com/namnguyendev/raw/upload/${newPublicId}`,
          },
        },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  deleteManyByColumnId,
  unshiftNewComment,
  updateMembers,
  pushAttachments,
  createDeadlineInCard,
  deleteAttachment,
  renameAttachment,
};
