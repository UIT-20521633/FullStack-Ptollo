import { pick } from "lodash";
/**
 * Simple method to Convert a String to Slug
 * Các bạn có thể tham khảo thêm kiến thức liên quan ở đây: https://byby.dev/js-slugify-string
 */
export const slugify = (val) => {
  if (!val) return ""; // Nếu giá trị đầu vào không tồn tại (null, undefined, hoặc rỗng), trả về chuỗi rỗng.
  return String(val) // Chuyển giá trị đầu vào thành chuỗi để xử lý.
    .normalize("NFKD") // Chuẩn hóa chuỗi theo chuẩn Unicode (NFKD) để tách ký tự và dấu (vd: 'é' thành 'e' và dấu sắc).
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ toàn bộ dấu (dấu sắc, huyền, hỏi, ngã, nặng...).
    .trim() // Loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi.
    .toLowerCase() // Chuyển toàn bộ chuỗi thành chữ thường.
    .replace(/[^a-z0-9 -]/g, "") // Xóa các ký tự không hợp lệ, chỉ giữ lại chữ cái, số, khoảng trắng và dấu gạch ngang.
    .replace(/\s+/g, "-") // Thay thế tất cả các khoảng trắng (bao gồm tab, newline) bằng dấu gạch ngang.
    .replace(/-+/g, "-"); // Loại bỏ các dấu gạch ngang liên tiếp, chỉ để lại một dấu gạch ngang.
};

// Lấy một vài dữ liệu cụ thể trong User để tránh việc trả về các dữ liệu nhạy cảm như hash password
export const pickUser = (user) => {
  if (!user) return {};
  return pick(user, [
    "_id",
    "email",
    "username",
    "displayName",
    "avatar",
    "role",
    "isActive",
    "recentlyViewed",
    "starredBoards",
    "createdAt",
    "updatedAt",
  ]);
};
