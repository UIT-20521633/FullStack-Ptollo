/* eslint-disable no-useless-catch */
import { callModel } from "~/models/callModel";
import { generateToken04 } from "~/utils/zegoServerAssistant";
import { env } from "~/config/environment";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { randomID } from "~/utils/algorithms";
import { userModel } from "~/models/userModel";
import { INVITATION_TYPES, ROOM_INVITATION_STATUS } from "~/utils/constants";
import { invitationModel } from "~/models/invitationModel";
import { pickUser } from "~/utils/formatters";
import { getReceiverSocketId } from "~/sockets/getReceiverSocketId";
import { boardModel } from "~/models/boardModel";
const TOKEN_INFO = {
  APPID: env.APPID,
  SERVER_SECRET: env.SERVER_SECRET,
  EFFECTIVE_TIME: 3600,
};
const renewToken = async (reqBody) => {
  const { userId } = reqBody;
  const token = generateToken04(
    Number(TOKEN_INFO.APPID),
    userId,
    TOKEN_INFO.SERVER_SECRET,
    3600,
    ""
  );
  return { token: token };
};

const createRoom = async (req, reqBody) => {
  try {
    // Lấy ra roomId và userId từ reqBody
    const { userId, userName } = reqBody; // Thông tin người tạo và các thành viên tham gia
    const roomId = randomID(15); // Auto-generate room ID
    // Tạo data cần thiết để lưu vào trong DB
    // Có thể thử bỏ hoặc làm sai lệch type, boardInvitation, status để test xem Model validate ok chưa.
    const token = generateToken04(
      Number(TOKEN_INFO.APPID),
      userId,
      TOKEN_INFO.SERVER_SECRET,
      86400,
      ""
    );
    const newRoomData = {
      roomId: roomId,
      userId: userId,
      userName: userName,
      token: token,
    };
    // Gọi sang Model để lưu vào DB
    const createdCallRoom = await callModel.createRoom(newRoomData);
    if (createdCallRoom) {
      return {
        roomId: roomId,
        token: token,
      };
    } else {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to create room"
      );
    }
  } catch (error) {
    throw error;
  }
};
const joinRoom = async (reqBody) => {
  const { roomId, userId } = reqBody;
  const existingRoom = await callModel.findByRoomId(roomId);
  if (existingRoom) {
    const token = generateToken04(
      Number(TOKEN_INFO.APPID),
      userId,
      TOKEN_INFO.SERVER_SECRET,
      86400,
      ""
    );
    return {
      roomId: roomId,
      token: token,
    };
  } else {
    throw new ApiError(StatusCodes.NOT_FOUND, "Room not found");
  }
};
const sendRoom = async (roomId, listUserRoom, creatUserRoomId, boardId) => {
  const existingRoom = await callModel.findByRoomId(roomId);
  // Tìm luôn cái board ra để lấy data xử lý
  const board = await boardModel.findOneById(boardId);
  //Kiểm tra xem room có tồn tại không

  if (!existingRoom) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Room not found");
  }

  const listData = await Promise.all(
    listUserRoom.map(async (memberId) => {
      const newInvitationData = {
        inviterId: creatUserRoomId,
        inviteeId: memberId,
        type: INVITATION_TYPES.ROOM_INVITATION,
        roomInvitation: {
          roomId: roomId,
          boardId: board._id.toString(),
          status: ROOM_INVITATION_STATUS.PENDING,
        },
      };
      //Lấy thông tin member
      const creatUserRoom = await userModel.findOneById(creatUserRoomId);
      const invitee = await userModel.findOneById(memberId);
      const createdInvitation = await invitationModel.createNewRoomInvitation(
        newInvitationData
      );
      const getInvitation = await invitationModel.findOneById(
        createdInvitation.insertedId
      );
      return {
        ...getInvitation,
        board,
        inviter: pickUser(creatUserRoom),
        invitee: pickUser(invitee),
      };
    })
  );
  //edit data to send to socket

  //Gửi thông báo qua socket cho các user trong listUserRoom
  global.io.emit("inviteToRoom", listData);

  // Gửi thông báo qua socket
  // Lấy ra danh sách user online thuộc listUserRoom
  return listData;
};
const getRoom = async (userId) => {
  try {
    const getInvitationsRoom = await invitationModel.findByUser(userId);
    //Lấy mảng danh sách có type là ROOM_INVITATION
    const fillerInvitationsRoom = getInvitationsRoom.filter(
      (invitation) => invitation.type === INVITATION_TYPES.ROOM_INVITATION
    );
    const resInvitationsRoom = fillerInvitationsRoom.map((i) => ({
      ...i,
      inviter: i.inviter[0] || {}, //sửa từ mảng thành object do mảng chỉ có 1 phần tử
      invitee: i.invitee[0] || {},
      board: i.board[0] || {},
    }));
    return resInvitationsRoom;
  } catch (error) {
    throw error;
  }
};

export const callService = {
  createRoom,
  joinRoom,
  renewToken,
  sendRoom,
  getRoom,
};
