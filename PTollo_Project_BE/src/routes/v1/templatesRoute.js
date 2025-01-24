import express from "express";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { tempaltesValidation } from "~/validations/templatesValidation";
import { templatesController } from "~/controllers/templatesController";

const Router = express.Router();
//tạo mới template và lấy danh sách template
Router.route("/")
  .post(
    authMiddleware.isAuthorized,
    tempaltesValidation.createTemplate,
    templatesController.createTemplate
  )
  .get(authMiddleware.isAuthorized, templatesController.getTemplates);

Router.route("/:id")
  //update, lấy thông tin và xóa template
  .put(
    authMiddleware.isAuthorized,
    tempaltesValidation.updateTemplate,
    templatesController.updateTemplateDetails
  )
  .get(authMiddleware.isAuthorized, templatesController.getTemplateDetails)
  .delete(authMiddleware.isAuthorized, templatesController.deleteTemplate);
// Tạo board mới bằng cách sao chép cấu trúc từ template
Router.route("/:id/clone").post(
  authMiddleware.isAuthorized,
  templatesController.cloneTemplate
);

export const templatesRoute = Router;
