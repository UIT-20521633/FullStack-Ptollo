export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/;
export const OBJECT_ID_RULE_MESSAGE =
  "Your string fails to match the Object Id pattern!";

// Một vài biểu thức chính quy - Regular Expression và custom message.
// Về Regular Expression khá hại não: https://viblo.asia/p/hoc-regular-expression-va-cuoc-doi-ban-se-bot-kho-updated-v22-Az45bnoO5xY
export const FIELD_REQUIRED_MESSAGE = "This field is required.";
export const EMAIL_RULE = /^\S+@\S+\.\S+$/;
export const EMAIL_RULE_MESSAGE = "Email is invalid. (example@namnguyen.com)";
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/;
export const PASSWORD_RULE_MESSAGE =
  "Password must include at least 1 letter, a number, and at least 8 characters.";

// Liên quan đến Validate File
export const LIMIT_COMMON_FILE_SIZE_IMG = 10485760; // byte = 10 MB
export const LIMIT_COMMON_FILE_SIZE = 52428800 * 2; // byte = 100 MB
//chuyên dùng cho việc upload file ảnh
export const ALLOW_COMMON_FILE_TYPES_IMG = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/svg+xml",
];
//chuyên dùng cho việc upload file image và các file như pdf, doc, excel, ppt, txt, zip, rar, 7z, tar, docx, xlsx, pptx, json, csv...
export const ALLOW_COMMON_FILE_TYPES = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/svg+xml",
  "application/pdf", //pdf
  "application/msword", //doc
  "application/vnd.ms-excel", //excel
  "application/vnd.ms-powerpoint", //ppt
  "text/plain", //txt
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", //docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", //xlsx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", //pptx
  "application/zip", //zip file
  "application/x-zip-compressed", //zip file
];
