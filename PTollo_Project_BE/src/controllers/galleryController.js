import { StatusCodes } from "http-status-codes";
import { env } from "~/config/environment";
import { galleryService } from "~/services/galleryService";
const UNSPLASH_ACCESS_KEY = env.UNSPLASH_ACCESS_KEY; // Thay bằng API Key từ Unsplash

const getGallery = async (req, res, next) => {
  try {
    const url = `https://api.unsplash.com/photos?page=1&client_id=${UNSPLASH_ACCESS_KEY}&per_page=900`;
    const images = await galleryService.getGallery(url);
    res.status(StatusCodes.OK).json(images);
  } catch (error) {
    next(error);
  }
};
const searchGallery = async (req, res, next) => {
  try {
    const query = req.query.query || "background"; // Từ khóa tìm kiếm
    const url = `https://api.unsplash.com/search/photos?query=${query}&page=10&client_id=${UNSPLASH_ACCESS_KEY}&per_page=900`;
    const images = await galleryService.searchGallery(url);
    res.status(StatusCodes.OK).json(images);
  } catch (error) {
    next(error);
  }
};

export const galleryController = {
  getGallery,
  searchGallery,
};
