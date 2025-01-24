export const generateColorImageURL = (color) => {
  if (!color.startsWith("#")) {
    return color; // Nếu không phải mã màu, giả định đây là URL ảnh đã hợp lệ
  }

  const canvas = document.createElement("canvas");
  canvas.width = "100%";
  canvas.height = "100%";

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);

  return canvas.toDataURL("image/png");
};
