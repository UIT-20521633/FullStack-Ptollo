import express from "express";
import { userValidation } from "~/validations/userValidation";
import { userController } from "~/controllers/userController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { multerUploadMiddleware } from "~/middlewares/multerUploadMiddleware";

const Router = express.Router();

Router.route("/signup").post(
  userValidation.createNew,
  userController.createNew
);
Router.route("/verify").put(
  userValidation.verifyAccount,
  userController.verifyAccount
);
Router.route("/login").post(userValidation.login, userController.login);
Router.route("/logout").delete(userController.logout);
Router.route("/refresh_token").get(userController.refreshToken);
Router.route("/star_board").get(
  authMiddleware.isAuthorized,
  userController.getStarredBoards
);
Router.route("/recently_viewed").get(
  authMiddleware.isAuthorized,
  userController.getRecentlyViewedBoards
);
//để update account thì cần phải authorized để check xem user đã login chưa mới cho update account được (chỉ update account của chính mình)
Router.route("/update").put(
  authMiddleware.isAuthorized,
  multerUploadMiddleware.upload.single("avatar"),
  userValidation.update,
  userController.update
);

export const userRouter = Router;
