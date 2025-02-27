/**
 * namnguyen
 * Controller: chịu trách nhiệm là điều hướng dữ liệu và nhận request từ client
 */

import { StatusCodes } from "http-status-codes";
import { columnService } from "~/services/columnService";

const createNew = async (req, res, next) => {
  try {
    //Điều hướng dữ liệu sang tầng Service
    const createNewColumn = await columnService.createNew(req.body);
    //Có kết quả thì trả về (response) cho client
    res.status(StatusCodes.CREATED).json(createNewColumn);
  } catch (error) {
    next(error);
  }
};
const update = async (req, res, next) => {
  try {
    const columnId = req.params.id;
    const updatedColumn = await columnService.update(columnId, req.body);
    res.status(StatusCodes.OK).json(updatedColumn);
  } catch (error) {
    next(error);
  }
};
const deleteItem = async (req, res, next) => {
  try {
    const columnId = req.params.id;
    const result = await columnService.deleteItem(columnId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const columnController = { createNew, update, deleteItem };
