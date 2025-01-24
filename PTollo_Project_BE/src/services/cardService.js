/* eslint-disable no-useless-catch */
/**
 * namnguyen
 */
import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";
import { userModel } from "~/models/userModel";
import { CloudinaryProvider } from "~/providers/CloudinaryProvider";

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody,
    };
    const createdCard = await cardModel.createNew(newCard);
    const getNewCard = await cardModel.findOneById(
      createdCard.insertedId.toString()
    );
    if (getNewCard) {
      //Cập nhật lại mảng cardOrderIds trong collection columns
      await columnModel.pushCardOrderIds(getNewCard);
    }
    return getNewCard;
  } catch (error) {
    throw error;
  }
};
const update = async (cardId, reqBody, cardCoverFile, userInfo) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    let updatedCard = {};
    if (cardCoverFile) {
      //Trường hợp upload file lên Cloud Storage, cụ thể là Cloudinary
      const uploadedResult = await CloudinaryProvider.streamUpload(
        cardCoverFile.buffer,
        "card-covers"
      );
      //Lưu lại url (secure_url) của file ảnh vào db
      updatedCard = await cardModel.update(cardId, {
        cover: uploadedResult.secure_url,
      });
    } else if (updateData.commentToAdd) {
      //Trường hợp thêm comment
      //tạo data comment để thêm vào database, cần bổ sung thêm những field cần thiết
      const commentData = {
        ...updateData.commentToAdd,
        userId: userInfo._id,
        userEmail: userInfo.email,
        commentedAt: Date.now(),
      };
      //dùng unshift để thêm comment mới vào đầu mảng comments unshift: thêm vào đầu mảng
      //ngược lại với push: thêm vào cuối mảng
      updatedCard = await cardModel.unshiftNewComment(cardId, commentData);
    } else if (updateData.incomingMemberInfo) {
      //Trường hợp ADD or REMOVE thành viên vào/ra khỏi card
      updatedCard = await cardModel.updateMembers(
        cardId,
        updateData.incomingMemberInfo
      );
    } else if (
      updateData.isComplete !== null &&
      updateData.isComplete !== undefined
    ) {
      //Trường hợp cập nhật trạng thái hoàn thành deadline của card
      const dataDeadline = {
        ...updateData,
        userCreateDealineId: userInfo._id,
      };
      updatedCard = await cardModel.update(cardId, dataDeadline);
    } else {
      //các trường hợp update chỉ dữ liệu không update ảnh
      updatedCard = await cardModel.update(cardId, updateData);
    }
    return updatedCard;
  } catch (error) {
    throw error;
  }
};
const uploadAttachments = async (cardId, attachments, userInfo) => {
  try {
    const uploadedAttachments = [];
    for (let i = 0; i < attachments.length; i++) {
      const uploadedResult = await CloudinaryProvider.streamRawUpload(
        attachments[i].buffer,
        "card-attachments",
        {
          public_id: attachments[i].originalname,
        }
      );
      uploadedAttachments.push({
        userId: userInfo._id, //lấy thông tin userId từ userInfo là người upload file lên
        typeFile: attachments[i].mimetype, //lấy kiểu file
        url: uploadedResult.secure_url, //lấy url của file đã upload lên
        publicId: uploadedResult.public_id, //lấy publicId của file đã upload lên
        fileName: attachments[i].originalname, //lấy tên file gốc
        uploadedAt: Date.now(), //lấy thời gian upload file
      });
    }
    const updatedCard = await cardModel.pushAttachments(
      cardId,
      uploadedAttachments
    );
    const getUserInfo = await userModel.findOneById(userInfo._id);
    return {
      updatedCard,
      userInfo: {
        _id: getUserInfo._id,
        email: getUserInfo.email,
        username: getUserInfo.username,
        displayName: getUserInfo.displayName,
        avatar: getUserInfo.avatar,
      },
    };
  } catch (error) {
    throw error;
  }
};
const updateDeadline = async (cardId, updateData, userCreateDealine) => {
  //Cập nhật deadline và reminderTime cho card
  try {
    if (updateData.deadline && updateData.reminderTime) {
      const dataToUpdate = {
        deadline: updateData.deadline,
        reminderTime: updateData.reminderTime,
        userCreateDealineId: userCreateDealine._id,
      };
      const updatedCard = await cardModel.createDeadlineInCard(
        cardId,
        dataToUpdate
      );
      return updatedCard;
    }
  } catch (error) {
    throw error;
  }
};
// const sendCardAndBoardDeadline = async (card, board, type) => {
//   //Lưu thông báo vào collection notifications và gửi thông báo cho người dùng
//   try {
//     const listData = await Promise.all(
//       card?.memberIds.map(async (memberId) => {
//         const newInvitationData = {
//           inviterId: card.userCreateDealineId,
//           inviteeId: memberId,
//           type: type,
//           cardInvitation: {
//             cardId: card._id.toString(),
//             boardId: board._id.toString(),
//             status: 0,
//           },
//         };
//         const userCreateDeadline = await userModel.findOneById(
//           card.userCreateDealineId
//         );
//         const invitee = await userModel.findOneById(memberId);
//         const createdInvitation = await invitationModel.createNewRoomInvitation(
//           newInvitationData
//         );
//         const getInvitation = await invitationModel.findOneById(
//           createdInvitation.insertedId
//         );
//         return {
//           ...getInvitation,
//           board,
//           inviter: pickUser(userCreateDeadline),
//           invitee: pickUser(invitee),
//         };
//       })
//     );
//     return listData;
//   } catch (error) {
//     throw error;
//   }
// };
const deleteAttachment = async (publicId, cardId, userId) => {
  try {
    const fileNameDeleted = publicId.split("/").pop(); //Lấy tên file đã xóa
    await CloudinaryProvider.destroyFile(publicId);
    // Cập nhật database: Xóa file khỏi `attachments`
    const updatedCard = await cardModel.deleteAttachment(cardId, publicId);
    //Lay thong tin user
    const getUserInfo = await userModel.findOneById(userId);
    //Sau khi xóa file thì ghi log vào phần activity của card
    // await cardModel.unshiftNewComment(cardId, {
    //   userId: userId,
    //   userAvatar: getUserInfo.avatar,
    //   userDisplayName: getUserInfo.displayName,
    //   userEmail: getUserInfo.email,
    //   content: `${getUserInfo.displayName} đã xóa file "${fileNameDeleted}"`,
    //   commentedAt: Date.now(),
    // });
    return updatedCard;
  } catch (error) {
    throw error;
  }
};
const renameAttachment = async (cardId, publicId, newName, userId) => {
  try {
    const [folder, oldFileName] = publicId.split("/");
    const fileExtension = oldFileName.split(".").pop();
    // Sao chép file với tên mới
    const newPublicId = `${folder}/${newName}.${fileExtension}`;
    const renamedAttachment = await CloudinaryProvider.renameFile(
      publicId,
      newPublicId
    );
    console.log("renamedAttachment", renamedAttachment);

    // Cập nhật database: Cập nhật `fileName` và `publicId`
    // const updatedCard = await cardModel.renameAttachment(
    //   cardId,
    //   newName,
    //   fileExtension,
    //   publicId,
    //   newPublicId
    // );
    //Lay thong tin user
    const getUserInfo = await userModel.findOneById(userId);
    await cardModel.unshiftNewComment(cardId, {
      userId: userId,
      userAvatar: getUserInfo.avatar,
      userDisplayName: getUserInfo.displayName,
      userEmail: getUserInfo.email,
      content: `${getUserInfo.displayName} đã đổi tên file "${oldFileName}" thành "${newName}.${fileExtension}"`,
      commentedAt: Date.now(),
    });
    return renamedAttachment;
  } catch (error) {
    throw error;
  }
};
export const cardService = {
  createNew,
  update,
  uploadAttachments,
  updateDeadline,
  deleteAttachment,
  renameAttachment,
};
