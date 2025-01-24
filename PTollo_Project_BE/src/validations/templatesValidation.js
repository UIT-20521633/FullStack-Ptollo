import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const createTemplate = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).messages({
      "string.empty": "Title is required",
      "string.min": "Title must have at least 3 characters",
      "string.max": "Title cannot exceed 50 characters",
    }),
    description: Joi.string().required().min(10).max(256).messages({
      "string.empty": "Description is required",
      "string.min": "Description must have at least 10 characters",
      "string.max": "Description cannot exceed 256 characters",
    }),
    background: Joi.string().uri().required().messages({
      "string.empty": "Background is required",
      "string.uri": "Background must be a valid URL",
    }),
    columns: Joi.array()
      .items(
        Joi.object({
          title: Joi.string().required().min(3).max(50),
          cardOrderIds: Joi.array().items(Joi.string()).required(),
          cards: Joi.array()
            .items(
              Joi.object({
                title: Joi.string().required().min(3).max(50),
                description: Joi.string().optional().allow(null, ""),
                cover: Joi.string().uri().allow(null).messages({
                  "string.uri": "Cover must be a valid URL",
                }),
              })
            )
            .required(),
        })
      )
      .min(1)
      .required(),
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
const updateTemplate = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string()
      .min(3)
      .max(50)
      .messages({
        "string.min": "Title must have at least 3 characters",
        "string.max": "Title cannot exceed 50 characters",
      })
      .optional(),
    description: Joi.string()
      .min(10)
      .max(256)
      .messages({
        "string.min": "Description must have at least 10 characters",
        "string.max": "Description cannot exceed 256 characters",
      })
      .optional(),
    background: Joi.string()
      .uri()
      .messages({
        "string.uri": "Background must be a valid URL",
      })
      .optional(),
    columns: Joi.array()
      .items(
        Joi.object({
          title: Joi.string().min(3).max(50).optional,
          cardOrderIds: Joi.array().items(Joi.string()).optional(),
          cards: Joi.array()
            .items(
              Joi.object({
                title: Joi.string().min(3).max(50).optional(),
                description: Joi.string().optional(),
                cover: Joi.string()
                  .uri()
                  .allow(null)
                  .messages({
                    "string.uri": "Cover must be a valid URL",
                  })
                  .optional(),
              })
            )
            .optional(),
        })
      )
      .min(1)
      .optional(),
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

export const tempaltesValidation = {
  createTemplate,
  updateTemplate,
};
