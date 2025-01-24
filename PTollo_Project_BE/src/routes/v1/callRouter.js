import express from "express";
import { callController } from "~/controllers/callController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { callValidation } from "~/validations/callValidation";

const Router = express.Router();

Router.route("/renew-token").post(
  authMiddleware.isAuthorized,
  callValidation.renewToken,
  callController.renewToken
);
Router.route("/create-room").post(
  authMiddleware.isAuthorized,
  callValidation.createRoom,
  callController.createRoom
);
Router.route("/join-room").post(
  authMiddleware.isAuthorized,
  callValidation.joinRoom,
  callController.joinRoom
);
Router.route("/send-room").post(
  authMiddleware.isAuthorized,
  callValidation.sendRoom,
  callController.sendRoom
);
Router.route("/get-room").get(
  authMiddleware.isAuthorized,
  callController.getRoom
);

export const callRouter = Router;
