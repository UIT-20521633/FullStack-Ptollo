/* eslint-disable no-useless-catch */
/**
 * namnguyen
 */
import { columnModel } from "~/models/columnModel";
import { boardModel } from "~/models/boardModel";
import { cardModel } from "~/models/cardModel";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody,
    };
    const createdColumn = await columnModel.createNew(newColumn);
    const getNewColumn = await columnModel.findOneById(
      createdColumn.insertedId.toString()
    );

    if (getNewColumn) {
      //Xử lý cấu trúc data ở đây trước khi trả dữ liệu về
      getNewColumn.cards = [];

      //Cập nhật lại mảng columnOrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn);
    }
    return getNewColumn;
  } catch (error) {
    throw error;
  }
};
const update = async (columId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedColumn = await columnModel.update(columId, updateData);
    return updatedColumn;
  } catch (error) {
    throw error;
  }
};
const deleteItem = async (columId) => {
  try {
    const tagetColumn = await columnModel.findOneById(columId);

    if (!tagetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Column not found");
    }
    //Xóa column trong collection columns
    await columnModel.deleteOneById(columId);
    //xóa toàn bộ card trong column
    await cardModel.deleteManyByColumnId(columId);
    //Xóa columnId trong mảng columnOrderIds của collection boards
    await boardModel.pullColumnOrderIds(tagetColumn);

    return { deleteResult: "Delete column & card successfully" };
  } catch (error) {
    throw error;
  }
};

export const columnService = { createNew, update, deleteItem };
