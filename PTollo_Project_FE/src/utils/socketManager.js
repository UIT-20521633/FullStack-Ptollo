import { io } from "socket.io-client";
import { API_ROOT } from "~/utils/constants";

let socket;

export const initializeSocket = (userId) => {
  if (!socket) {
    socket = io(API_ROOT, { query: { userId } });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
