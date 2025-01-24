/* eslint-disable no-useless-catch */
// Lấy danh sách user để hiển thị ở sidebar
import { boardModel } from "~/models/boardModel";
import { messagesModel } from "~/models/messageModel";
import { userModel } from "~/models/userModel";
import { CloudinaryProvider } from "~/providers/CloudinaryProvider";
import { getReceiverSocketId } from "~/sockets/getReceiverSocketId";

const getUsersInBoard = async (userId, boardId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    //lọc ra những user member trong board
    const Board = await boardModel.findOneById(boardId);
    // Check if Board exists
    if (!Board) {
      throw new Error(`Board with id ${boardId} not found`);
    }
    const allMembersIds = [...Board.ownerIds, ...Board.memberIds].toString();
    const fillteredUsers = await userModel.filterUsersNeUserId(userId);

    // Lấy ra những user có _id trùng với allMembersIds
    const fillterUsersOfBoard = fillteredUsers.filter((user) =>
      allMembersIds.includes(user._id.toString())
    );
    return [...fillterUsersOfBoard];
  } catch (error) {
    throw error;
  }
};
const getMessages = async (boardId, senderId, userToChatId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const existBoard = await boardModel.findOneById(boardId);
    if (!existBoard) {
      throw new Error(`Board with id ${boardId} not found`);
    }
    const myId = senderId;
    //Lấy ra những tin nhắn mà senderId và receiverId là người gửi và người nhận
    const messages = await messagesModel.findMessagesFromSenderAndReceiverId(
      myId,
      userToChatId,
      boardId
    );
    return messages;
  } catch (error) {
    throw error;
  }
};
const sendMessage = async (boardId, senderId, receiverId, text, image) => {
  try {
    let imgUrl = null;

    // Chỉ upload ảnh nếu có
    if (image) {
      const uploadedResult = await CloudinaryProvider.streamUpload(
        image.buffer,
        "message_image"
      );
      imgUrl = uploadedResult.secure_url;
    }
    // Tạo tin nhắn mới
    const newMessage = {
      boardId,
      senderId,
      receiverId,
      text,
      image: imgUrl || null, // Nếu không có ảnh, để là null
    };

    // Lưu tin nhắn vào database
    await messagesModel.sendMessage(newMessage);

    //todo: function real-time gửi tin nhắn => socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      global.io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return newMessage;
  } catch (error) {
    throw error;
  }
};

export const messageService = {
  getUsersInBoard,
  getMessages,
  sendMessage,
};
