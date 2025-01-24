/**
 * namnguyen
 * Controller: chịu trách nhiệm là điều hướng dữ liệu và nhận request từ client
 */

import { StatusCodes } from "http-status-codes";
import { boardService } from "~/services/boardService";

const createNew = async (req, res, next) => {
  try {
    // console.log(req.body);
    // console.log(req.query);
    // console.log(req.params);
    // console.log(req.files);
    // console.log(req.cookies);
    // console.log(req.jwtDecoded);
    const userId = req.jwtDecoded._id;

    //Điều hướng dữ liệu sang tầng Service
    const createNewBoard = await boardService.createNew(userId, req.body);

    //Có kết quả thì trả về (response) cho client
    res.status(StatusCodes.CREATED).json(createNewBoard);
    //Test Error Handling
    // throw new ApiError(StatusCodes.BAD_REQUEST, "Test Error Handling");
  } catch (error) {
    //Nếu có lỗi thì express sẽ tự động chuyển qua middleware xử lý lỗi tập trung ở phía server.js
    next(error);
  }
};
const getDetails = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const boardId = req.params.id;
    const board = await boardService.getDetails(userId, boardId);

    res.status(StatusCodes.OK).json(board);
  } catch (error) {
    //Nếu có lỗi thì express sẽ tự động chuyển qua middleware xử lý lỗi tập trung ở phía server.js
    next(error);
  }
};
const update = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    const updateBoard = await boardService.update(boardId, req.body);
    res.status(StatusCodes.OK).json(updateBoard);
  } catch (error) {
    //Nếu có lỗi thì express sẽ tự động chuyển qua middleware xử lý lỗi tập trung ở phía server.js
    next(error);
  }
};
const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    //Nếu có lỗi thì express sẽ tự động chuyển qua middleware xử lý lỗi tập trung ở phía server.js
    next(error);
  }
};
const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    // page và itemsPerPage được truyền vào trong query url từ phía FE nên BE sẽ lấy thông qua req.query
    const { page, itemsPerPage, q } = req.query;
    const queryFilters = q;
    // console.log(queryFilters)

    const results = await boardService.getBoards(
      userId,
      page,
      itemsPerPage,
      queryFilters
    );

    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(error);
  }
};
const addRecentlyViewedBoard = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const boardId = req.params.id;
    const result = await boardService.addRecentlyViewedBoard(userId, boardId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const addStarBoard = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const boardId = req.params.id;
    const result = await boardService.addStarBoard(userId, boardId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const updateBackground = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    const { background } = req.body;
    const result = await boardService.updateBackground(boardId, background);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const updateBackgroundFromFile = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    const background = req.file;
    const result = await boardService.updateBackgroundFromFile(
      boardId,
      background
    );
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const completionBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    const result = await boardService.completionBoard(boardId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const convertBoardToTemplate = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const boardId = req.params.id;
    const result = await boardService.convertBoardToTemplate(userId, boardId);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoards,
  addRecentlyViewedBoard,
  addStarBoard,
  updateBackground,
  updateBackgroundFromFile,
  completionBoard,
  convertBoardToTemplate,
};
