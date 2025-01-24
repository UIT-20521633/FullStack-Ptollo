import fetch from "node-fetch";
import { env } from "~/config/environment";
import express from "express";

const UNSPLASH_ACCESS_KEY = env.UNSPLASH_ACCESS_KEY; // Thay bằng API Key từ Unsplash
const Router = express.Router();

Router.route.get("/unsplash-gallery", async (req, res) => {
  const query = req.query.query || "background"; // Từ khóa tìm kiếm
  const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=12`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const images = data.results.map((img) => ({
      id: img.id,
      url: img.urls.regular,
      alt: img.alt_description || "Unsplash Image",
    }));
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching Unsplash images:", error);
    res.status(500).json({ message: "Error fetching images" });
  }
});
