/**
 * namnguyen
 */
//Param socket sẽ được lấy từ thư viện socket.io
export const invateUserToBoardSocket = (socket) => {
  //lắng nghe sự kiện mà client emit lên tên là "FE_USER_INVITED_TO_BOARD"
  socket.on("FE_USER_INVITED_TO_BOARD", (invitation) => {
    //Cách làm nhanh và đơn giản nhất là emit ngược lại sự kiện này về cho tất cả các client khác (ngoại trừ chính client gửi request lên), để phía FE check
    socket.broadcast.emit("BE_USER_INVITED_TO_BOARD", invitation);
  });
};
