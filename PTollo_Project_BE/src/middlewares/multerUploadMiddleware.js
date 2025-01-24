import { StatusCodes } from "http-status-codes";
import multer from "multer";
import ApiError from "~/utils/ApiError";
import {
  ALLOW_COMMON_FILE_TYPES,
  LIMIT_COMMON_FILE_SIZE,
  ALLOW_COMMON_FILE_TYPES_IMG,
  LIMIT_COMMON_FILE_SIZE_IMG,
} from "~/utils/validators";

//Function kiểm tra file được chấp nhận
const customFileImgFilter = (req, file, callback) => {
  //Đối với multer, kiểm tra kiểu file thì sử dụng mimetype
  if (!ALLOW_COMMON_FILE_TYPES_IMG.includes(file.mimetype)) {
    const errMes = "File type is invalid. Only accept jpg, jpeg and png";
    return callback(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errMes),
      null
    );
  }
  //Nếu kiểu file hợp lệ thì trả về null
  return callback(null, true);
};
//function kiểm tra multer upload file
const customFileFilter = (req, file, callback) => {
  //Đối với multer, kiểm tra kiểu file thì sử dụng mimetype
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errMes = "File type is invalid. File not support";
    return callback(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errMes),
      null
    );
  }
  //Nếu kiểu file hợp lệ thì trả về null
  return callback(null, true);
};

//Khởi tạo function upload được bọc bởi middleware multer
const upload = multer({
  limits: {
    fileSize: LIMIT_COMMON_FILE_SIZE_IMG,
  },
  fileFilter: customFileImgFilter,
});
//Khởi tạo function upload được bọc bởi middleware multer
const uploadFiles = multer({
  limits: {
    fileSize: LIMIT_COMMON_FILE_SIZE,
  },
  fileFilter: customFileFilter,
}).array("attachments", 5); // Định nghĩa "attachments" là tên trường và giới hạn số lượng tệp;

//Export function upload
export const multerUploadMiddleware = { upload, uploadFiles };
