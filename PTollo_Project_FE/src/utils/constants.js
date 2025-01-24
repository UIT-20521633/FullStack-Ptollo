/* eslint-disable no-undef */
// export const API_ROOT = "http://localhost:8017";
let apiRoot = "";
// Môi trường Dev sẽ chạy localhost với port 8017
if (process.env.BUILD_MODE === "dev") {
  apiRoot = "http://localhost:8017";
}
// Môi trường Production sẽ cần api endpoint chuẩn của các bạn
if (process.env.BUILD_MODE === "production") {
  // Lưu ý: Đây là domain ví dụ sau khi Deploy Production
  apiRoot = "https://ptollo-pj-api.onrender.com";
}
// console.log('🚀 ~ file: constants.js:7 ~ apiRoot:', apiRoot)
export const API_ROOT = apiRoot;

export const DEFAULT_PAGE = 1;
export const DEFAULT_ITEMS_PER_PAGE = 12;
export const DEFAULT_ITEMS_PER_PAGE_STARRED = 8;

export const CARD_MEMBER_ACTIONS = {
  ADD: "ADD",
  REMOVE: "REMOVE",
};
