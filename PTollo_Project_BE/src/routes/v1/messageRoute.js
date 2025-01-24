import express from "express";
import { messageController } from "~/controllers/messageController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { messageValidation } from "~/validations/messageValidation";
import { multerUploadMiddleware } from "~/middlewares/multerUploadMiddleware";

const Router = express.Router();

//Lấy danh sách user trong board
Router.route("/:boardId/users").get(
  authMiddleware.isAuthorized,
  messageController.getUsersInBoard
);

Router.route("/:id").get(
  authMiddleware.isAuthorized,
  messageController.getMessages
);

Router.route("/send/:id").post(
  authMiddleware.isAuthorized,
  multerUploadMiddleware.upload.single("image"),
  messageValidation.sendMessage,
  messageController.sendMessage
);

export const messageRoute = Router;
