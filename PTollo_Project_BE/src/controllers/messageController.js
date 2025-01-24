import { StatusCodes } from "http-status-codes";
import { messageService } from "~/services/messageService";

const getUsersInBoard = async (req, res, next) => {
  try {
    // Lấy thông tin user từ token và boardId từ req.params
    const boardId = req.url.split("/")[1]; // Cắt theo dấu "/"
    const userId = req.jwtDecoded._id;
    // Lấy thông tin user từ DB
    const user = await messageService.getUsersInBoard(userId, boardId);
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};
const getMessages = async (req, res, next) => {
  try {
    const boardId = req.query.boardId; // Lấy boardId từ query string
    // userToChatId là id của user mà user hiện tại muốn chat với nó (lấy từ req.params)
    const userToChatId = req.params.id;
    //User hiện tại đang chat với userToChatId (lấy từ token) là người gửi
    const senderId = req.jwtDecoded._id;

    const messages = await messageService.getMessages(
      boardId,
      senderId,
      userToChatId
    );
    res.status(StatusCodes.OK).json(messages);
  } catch (error) {
    next(error);
  }
};
const sendMessage = async (req, res, next) => {
  try {
    const { text, boardId } = req.body;
    const image = req.file;
    const senderId = req.jwtDecoded._id;
    const receiverId = req.params.id;
    const sendMessage = await messageService.sendMessage(
      boardId,
      senderId,
      receiverId,
      text,
      image
    );
    res.status(StatusCodes.CREATED).json(sendMessage);
  } catch (error) {
    next(error);
  }
};

export const messageController = {
  getUsersInBoard,
  getMessages,
  sendMessage,
};
