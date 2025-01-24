import express from "express";
import { invitationValidation } from "~/validations/invitationValidation";
import { invitationController } from "~/controllers/invitationController";
import { authMiddleware } from "~/middlewares/authMiddleware";

const Router = express.Router();

Router.route("/board").post(
  authMiddleware.isAuthorized,
  invitationValidation.createNewBoardInvitation,
  invitationController.createNewBoardInvitation
);
//getInvitations - get all invitations of a user
Router.route("/").get(
  authMiddleware.isAuthorized,
  invitationController.getInvitations
);
//Cập nhật 1 bản ghi BoardInvitation
Router.route("/board/:invitationId").put(
  authMiddleware.isAuthorized,
  invitationController.updateBoardInvitation
);

export const invitationRoute = Router;
