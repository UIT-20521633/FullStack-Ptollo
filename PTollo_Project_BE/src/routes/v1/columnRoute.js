/**
 * Namnguyen
 */
import express from "express";
import { columnValidation } from "~/validations/columnValidation";
import { columnController } from "~/controllers/columnController";
import { authMiddleware } from "~/middlewares/authMiddleware";

const Router = express.Router();

Router.route("/")
  // .get((req, res) => {
  //Lấy dữ liệu từ database
  //   res.status(StatusCodes.OK).json({ message: "GET: API get list columns" });
  // })
  .post(
    authMiddleware.isAuthorized,
    columnValidation.createNew,
    columnController.createNew
  ); //Tạo mới dữ liệu
Router.route("/:id")
  //Update dữ liệu theo id
  .put(
    authMiddleware.isAuthorized,
    columnValidation.update,
    columnController.update
  )
  .delete(
    authMiddleware.isAuthorized,
    columnValidation.deleteItem,
    columnController.deleteItem
  );
export const columnRouter = Router;
