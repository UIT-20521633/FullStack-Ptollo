const getGallery = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data) {
      throw new Error("Unexpected response structure");
    }

    const images = data.map((img) => ({
      id: img?.id,
      url: img?.urls?.regular,
      alt: img?.alt_description || "Unsplash Image",
    }));
    return images;
  } catch (error) {
    throw new Error("Error fetching images");
  }
};
const searchGallery = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data) {
      throw new Error("Unexpected response structure");
    }

    const images = data.results.map((img) => ({
      id: img?.id,
      url: img?.urls?.regular,
      alt: img?.alt_description || "Unsplash Image",
    }));
    return images;
  } catch (error) {
    throw new Error("Error fetching images");
  }
};
export const galleryService = {
  getGallery,
  searchGallery,
};
