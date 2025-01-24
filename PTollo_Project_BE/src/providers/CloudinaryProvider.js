import cloudinary from "cloudinary";
import streamifier from "streamifier";
import { env } from "~/config/environment";

//Bước cấu hình cloudinary, sử dụng v2 - version 2 của cloudinary
const cloudinaryV2 = cloudinary.v2;
cloudinaryV2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Khởi tạo một cái function để thực hiện upload file lên Cloudinary
const streamUpload = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    // Tạo một cái luồng stream upload lên cloudinary
    const stream = cloudinaryV2.uploader.upload_stream(
      {
        folder: folderName,
      },
      (err, result) => {
        if (err) reject(err); //bác bỏ
        else resolve(result); //giải quyết
      }
    );
    // Thực hiện upload cái luồng trên bằng lib streamifier
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
const streamRawUpload = (fileBuffer, folderName, { ...props }) => {
  return new Promise((resolve, reject) => {
    // Tạo một cái luồng stream upload lên cloudinary
    const stream = cloudinaryV2.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: "raw" || "image",
        public_id: props.public_id,
      },
      (err, result) => {
        if (err) reject(err); //bác bỏ
        else resolve(result); //giải quyết
      }
    );
    // Thực hiện upload cái luồng trên bằng lib streamifier
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
const destroyFile = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinaryV2.uploader.destroy(publicId, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
const renameFile = (publicId, newName) => {
  return new Promise((resolve, reject) => {
    cloudinaryV2.uploader
      .rename(publicId, newName)
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

export const CloudinaryProvider = {
  streamUpload,
  streamRawUpload,
  destroyFile,
  renameFile,
};
