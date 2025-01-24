import Joi from "joi";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";

// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = "columns";
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  // Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé
  cardOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});
//chỉ ra các field(trường) không được phép cập nhật trong hàm update
const INVALIB_UPDATE_FIELDS = ["_id", "boardId", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data);
    const newColumnToAdd = {
      ...validatedData,
      boardId: new ObjectId(validatedData.boardId),
    };
    //validatedData sẽ chứa dữ liệu đã được validate từ Joi và có thêm các giá trị default
    // Thêm dữ liệu vào collection bằng hàm insertOne
    return await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .insertOne(newColumnToAdd);
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (columnId) => {
  try {
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(columnId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
//Hàm này sẽ push 1 cardId vào cuối mảng cardOrderIds trong collection columns
const pushCardOrderIds = async (card) => {
  try {
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        //Tìm kiếm boardId trong collection boards để push columnId vào cuối mảng columnOrderIds
        {
          _id: new ObjectId(card.columnId),
        },
        { $push: { cardOrderIds: new ObjectId(card._id) } },
        //Trả về dữ liệu sau khi đã update, mặc định nếu không có thì sẽ trả về dữ liệu trước khi update dù đã update thành công
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const update = async (columId, updateData) => {
  try {
    //Lọc ra các field không được phép update
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALIB_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });
    //Đối với những những dữ liệu cần update như ObjectId thì cần phải chuyển từ string sang ObjectId
    if (updateData.cardOrderIds) {
      updateData.cardOrderIds = updateData.cardOrderIds.map(
        (id) => new ObjectId(id)
      );
    }
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(columId),
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
const deleteOneById = async (columnId) => {
  try {
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .deleteOne({
        _id: new ObjectId(columnId),
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOrderIds,
  update,
  deleteOneById,
};
