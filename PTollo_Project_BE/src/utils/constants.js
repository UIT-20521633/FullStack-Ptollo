/**
namnguyen
 */
import { env } from "~/config/environment";
export const WHITELIST_DOMAINS = [
  // "http://localhost:5173",// Không cần localhost nữa vì ở file config/cors đã luôn luôn cho phép môi trường dev (env.BUILD_MODE === 'dev')
  //Sau này sẽ thêm các domain khác vào đây
  // "https://ptollo-web-uit.vercel.app",
  "https://vermillion-malabi-3d2c1a.netlify.app",
  "http://localhost:4173",
];

export const BOARD_TYPES = {
  PUBLIC: "public",
  PRIVATE: "private",
};
export const TEMPLATE_TYPES = {
  PUBLIC: "public",
  PRIVATE: "private",
};

export const WEBSITE_DOMAIN =
  env.BUILD_MODE === "production"
    ? env.WEBSITE_DOMAIN_PRODUCTION
    : env.WEBSITE_DOMAIN_DEVELOPMENT;

export const DEFAULT_PAGE = 1;
export const DEFAULT_ITEMS_PER_PAGE = 12;

export const INVITATION_TYPES = {
  BOARD_INVITATION: "BOARD_INVITATION",
  ROOM_INVITATION: "ROOM_INVITATION",
};
export const BOARD_INVITATION_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
};
export const ROOM_INVITATION_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
};

export const CARD_MEMBER_ACTIONS = {
  ADD: "ADD",
  REMOVE: "REMOVE",
};
