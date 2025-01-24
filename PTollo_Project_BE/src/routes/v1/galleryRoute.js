import express from "express";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { galleryController } from "~/controllers/galleryController";

const Router = express.Router();

Router.route("/unsplash-gallery").get(
  authMiddleware.isAuthorized,
  galleryController.getGallery
);
Router.route("/unsplash-search").get(
  authMiddleware.isAuthorized,
  galleryController.searchGallery
);

export const galleryRoute = Router;
