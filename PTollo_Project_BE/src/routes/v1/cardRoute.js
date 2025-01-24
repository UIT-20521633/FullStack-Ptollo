/**
 * Namnguyen
 */
import express from "express";
import { cardValidation } from "~/validations/cardValidation";
import { cardController } from "~/controllers/cardController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { multerUploadMiddleware } from "~/middlewares/multerUploadMiddleware";

const Router = express.Router();

Router.route("/").post(
  authMiddleware.isAuthorized,
  cardValidation.createNew,
  cardController.createNew
); //Tạo mới dữ liệu
Router.route("/:id")
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single("cardCover"),
    cardValidation.update,
    cardController.update
  )
  .post(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.uploadFiles,
    cardController.uploadAttachments
  ); //Cập nhật dữ liệu

Router.route("/:id/deadline").post(
  authMiddleware.isAuthorized,
  cardValidation.updateDeadline,
  cardController.updateDeadline
);
Router.route("/:id/delete-attachment").post(
  authMiddleware.isAuthorized,
  cardValidation.deleteAttachment,
  cardController.deleteAttachment
);
Router.route("/:id/rename-attachment").put(
  authMiddleware.isAuthorized,
  cardValidation.renameAttachment,
  cardController.renameAttachment
);

export const cardRouter = Router;
