/* eslint-disable no-useless-catch */
import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";
import { TEMPLATE_TYPES } from "~/utils/constants";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

// Define Collection (name & schema)
const TEMPLATE_COLLECTION_NAME = "templates";
const TEMPLATE_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).messages({
    "string.empty": "Title is required",
    "string.min": "Title must have at least 3 characters",
    "string.max": "Title cannot exceed 50 characters",
  }),
  description: Joi.string().required().max(256).messages({
    "string.empty": "Description is required",
    "string.max": "Description cannot exceed 256 characters",
  }),
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  type: Joi.string()
    .required()
    .valid(...Object.values(TEMPLATE_TYPES))
    .default(TEMPLATE_TYPES.PUBLIC),
  background: Joi.string()
    .required()
    .messages({
      "string.empty": "Background is required",
    })
    .optional(),
  columns: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required().min(3).max(50),
        cards: Joi.array()
          .items(
            Joi.object({
              title: Joi.string().required().min(3).max(50),
              description: Joi.string().optional().allow(null),
              cover: Joi.string().allow(null).optional(),
            })
          )
          .required(),
      })
    )
    .min(0)
    .required(),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

// Fields that are not allowed to be updated
const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

// Validate message schema before creation
const validateBeforeCreate = async (data) => {
  return await TEMPLATE_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};
// Tạo Template mới
const createTemplate = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data);
    const result = await GET_DB()
      .collection(TEMPLATE_COLLECTION_NAME)
      .insertOne(validatedData);
    return result;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách Templates
const getTemplates = async () => {
  try {
    return await GET_DB().collection(TEMPLATE_COLLECTION_NAME).find().toArray();
  } catch (error) {
    throw error;
  }
};

// Lấy Template theo ID
const getTemplateById = async (id) => {
  try {
    return await GET_DB()
      .collection(TEMPLATE_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw error;
  }
};

// Xóa Template
const deleteTemplate = async (id) => {
  try {
    return await GET_DB()
      .collection(TEMPLATE_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw error;
  }
};
// Cập nhật Template
const updateTemplateDetails = async (id, data) => {
  try {
    //Xóa các trường không được cập nhật
    const updateData = { ...data, updatedAt: new Date() };
    INVALID_UPDATE_FIELDS.forEach((field) => {
      delete updateData[field];
    });
    return await GET_DB()
      .collection(TEMPLATE_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: "after" }
      );
  } catch (error) {
    throw error;
  }
};
const findOnebyId = async (id) => {
  try {
    return await GET_DB()
      .collection(TEMPLATE_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw error;
  }
};
export const templateModel = {
  TEMPLATE_COLLECTION_NAME,
  TEMPLATE_COLLECTION_SCHEMA,
  createTemplate,
  getTemplates,
  getTemplateById,
  deleteTemplate,
  updateTemplateDetails,
  findOnebyId,
};
