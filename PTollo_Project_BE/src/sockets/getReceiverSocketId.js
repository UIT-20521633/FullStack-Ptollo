// Lấy thông tin socketId của user từ userSocketMap
export const getReceiverSocketId = (userId) => {
  return global.userSocketMap[userId];
};
