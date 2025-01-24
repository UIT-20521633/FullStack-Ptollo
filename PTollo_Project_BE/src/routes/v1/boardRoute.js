/**
 * Namnguyen
 */
import express from "express";
import { boardValidation } from "~/validations/boardValidation";
import { boardController } from "~/controllers/boardController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { multerUploadMiddleware } from "~/middlewares/multerUploadMiddleware";

const Router = express.Router();
// /v1/boards
Router.route("/")
  .get(authMiddleware.isAuthorized, boardController.getBoards) //Lấy tất cả dữ liệu
  .post(
    authMiddleware.isAuthorized,
    boardValidation.createNew,
    boardController.createNew
  ); //Tạo mới dữ liệu

Router.route("/:id")
  //Lấy dữ liệu từ database theo id
  .get(authMiddleware.isAuthorized, boardController.getDetails)
  //Update dữ liệu theo id
  .put(
    authMiddleware.isAuthorized,
    boardValidation.update,
    boardController.update
  );
Router.route("/:id/recently_viewed").post(
  authMiddleware.isAuthorized,
  boardController.addRecentlyViewedBoard
);
Router.route("/:id/star_board").put(
  authMiddleware.isAuthorized,
  boardController.addStarBoard
);
//API hỗ trợ di chuyển card từ column này sang column khác
Router.route("/supports/moving_card").put(
  authMiddleware.isAuthorized,
  boardValidation.moveCardToDifferentColumn,
  boardController.moveCardToDifferentColumn
);

Router.route("/:id/background").put(
  authMiddleware.isAuthorized,
  boardValidation.updateBackground,
  boardController.updateBackground
);
Router.route("/:id/upload-image").put(
  authMiddleware.isAuthorized,
  multerUploadMiddleware.upload.single("background"),
  boardController.updateBackgroundFromFile
);
//API đánh giá độ hoàn thành của board
Router.route("/:id/completion-board").get(
  authMiddleware.isAuthorized,
  boardController.completionBoard
);
// Chuyển một board hiện có thành một template có thể tái sử dụng
Router.route("/:id/template").post(
  authMiddleware.isAuthorized,
  boardController.convertBoardToTemplate
);
export const boardRouter = Router;
