import { StatusCodes } from "http-status-codes";
import { callService } from "~/services/callService";

const renewToken = async (req, res, next) => {
  try {
    const resCall = await callService.renewToken(req.body);
    res.status(StatusCodes.OK).json(resCall);
  } catch (error) {
    next(error);
  }
};

const createRoom = async (req, res, next) => {
  try {
    const resCall = await callService.createRoom(req, req.body);
    res.status(StatusCodes.CREATED).json(resCall);
  } catch (error) {
    next(error);
  }
};
const joinRoom = async (req, res, next) => {
  try {
    const resCall = await callService.joinRoom(req.body);
    res.status(StatusCodes.OK).json(resCall);
  } catch (error) {
    next(error);
  }
};
const sendRoom = async (req, res, next) => {
  try {
    const { roomId, listUserRoom, boardId } = req.body;
    const creatUserRoomId = req.jwtDecoded._id; //lấy thông tin user từ token người gửi
    const resCall = await callService.sendRoom(
      roomId,
      listUserRoom,
      creatUserRoomId,
      boardId
    );
    res.status(StatusCodes.OK).json(resCall);
  } catch (error) {
    next(error);
  }
};
const getRoom = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const resCall = await callService.getRoom(userId);
    res.status(StatusCodes.OK).json(resCall);
  } catch (error) {
    next(error);
  }
};
export const callController = {
  createRoom,
  joinRoom,
  renewToken,
  sendRoom,
  getRoom,
};
