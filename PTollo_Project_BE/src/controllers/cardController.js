/**
 * namnguyen
 * Controller: chịu trách nhiệm là điều hướng dữ liệu và nhận request từ client
 */

import { StatusCodes } from "http-status-codes";
import { cardService } from "~/services/cardService";

const createNew = async (req, res, next) => {
  try {
    //Điều hướng dữ liệu sang tầng Service
    const createNewCard = await cardService.createNew(req.body);
    //Có kết quả thì trả về (response) cho client
    res.status(StatusCodes.CREATED).json(createNewCard);
  } catch (error) {
    next(error);
  }
};
const update = async (req, res, next) => {
  try {
    const cardId = req.params.id;
    const cardCoverFile = req.file;
    const userInfo = req.jwtDecoded;
    const updateCard = await cardService.update(
      cardId,
      req.body,
      cardCoverFile,
      userInfo
    );

    res.status(StatusCodes.OK).json(updateCard);
  } catch (error) {
    next(error);
  }
};
const uploadAttachments = async (req, res, next) => {
  try {
    const cardId = req.params.id;
    const attachments = req.files;
    const userInfo = req.jwtDecoded;
    const uploadAttachments = await cardService.uploadAttachments(
      cardId,
      attachments,
      userInfo
    );

    res.status(StatusCodes.OK).json(uploadAttachments);
  } catch (error) {
    next(error);
  }
};
const updateDeadline = async (req, res, next) => {
  try {
    const userCreateDealine = req.jwtDecoded;
    const cardId = req.params.id;
    const updateData = req.body;
    const updateDeadline = await cardService.updateDeadline(
      cardId,
      updateData,
      userCreateDealine
    );
    res.status(StatusCodes.OK).json(updateDeadline);
  } catch (error) {
    next(error);
  }
};
const deleteAttachment = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const cardId = req.params.id;
    const { publicId } = req.body;
    const deleteAttachment = await cardService.deleteAttachment(
      publicId,
      cardId,
      userId
    );
    res.status(StatusCodes.OK).json(deleteAttachment);
  } catch (error) {
    next(error);
  }
};
const renameAttachment = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const { publicId, newName } = req.body;
    const cardId = req.params.id;
    const renameAttachment = await cardService.renameAttachment(
      cardId,
      publicId,
      newName,
      userId
    );
    res.status(StatusCodes.OK).json(renameAttachment);
  } catch (error) {
    next(error);
  }
};
export const cardController = {
  createNew,
  update,
  uploadAttachments,
  updateDeadline,
  deleteAttachment,
  renameAttachment,
};
