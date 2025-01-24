/**
 * namnguyen
 */

import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardRouter } from "./boardRoute";
import { columnRouter } from "./columnRoute";
import { cardRouter } from "./cardRoute";
import { userRouter } from "./userRoute";
import { invitationRoute } from "./invitationRoute";
import { callRouter } from "./callRouter";
import { messageRoute } from "./messageRoute";
import { galleryRoute } from "./galleryRoute";
import { template } from "lodash";
import { templatesRoute } from "./templatesRoute";

const Router = express.Router();

//check APIs v1 status
Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "APIs V1 are ready to use" });
});

//Board APIs
Router.use("/boards", boardRouter);
//Columns APIs
Router.use("/columns", columnRouter);
//Cards APIs
Router.use("/cards", cardRouter);
//User APIs
Router.use("/users", userRouter);
//Invations APIs
Router.use("/invitations", invitationRoute);
//Call APIs
Router.use("/calls", callRouter);
//Message APIs
Router.use("/messages", messageRoute);
//Unsplash APIs
Router.use("/gallery", galleryRoute);
//Template APIs
Router.use("/templates", templatesRoute);

export const APIs_V1 = Router;
