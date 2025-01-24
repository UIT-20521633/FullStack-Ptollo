/* eslint-disable no-useless-catch */
/**
 * namnguyen
 */
import { pickUser, slugify } from "~/utils/formatters";
import { boardModel } from "~/models/boardModel";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { cloneDeep } from "lodash";
import { columnModel } from "~/models/columnModel";
import { cardModel } from "~/models/cardModel";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from "~/utils/constants";
import { userModel } from "~/models/userModel";
import { CloudinaryProvider } from "~/providers/CloudinaryProvider";
import { templateModel } from "~/models/templateModel";

//Service: chịu trách nhiệm xử lý logic, gọi DB, gọi các API khác
const createNew = async (userId, reqBody) => {
  try {
    //Xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };

    //Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào DB
    //createdBoard là kết quả trả về từ Model sau khi thêm vào DB
    const createdBoard = await boardModel.createNew(userId, newBoard);

    //Lấy bản ghi board sau khi gọi (tùy dự án)
    const getNewBoard = await boardModel.findOneById(
      createdBoard.insertedId.toString()
    );
    //Làm thêm các xử lý logic khác với các Collection khác tùy dự án
    //Bắn email, notification về cho admin khi có 1 board mới được tạo

    //trả kết quả về, trong Service luôn phải có return
    return getNewBoard;
  } catch (error) {
    throw error;
  }
};
const getDetails = async (userId, boardId) => {
  try {
    const board = await boardModel.getDetails(userId, boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");
    }
    //B1:Deep clone object để tránh thay đổi trực tiếp dữ liệu gốc không ảnh hưởng đến board ban đầu
    const resBoard = cloneDeep(board);
    //B2: Đưa card về đúng column
    resBoard.columns.forEach((column) => {
      //C1: column.cards = resBoard.cards.filter(
      //phải có toString() vì _id trả về là objectId của mongoDB (Khi so sánh hai giá trị ObjectId, JavaScript không thể so sánh chúng đúng cách vì chúng là đối tượng tham chiếu (reference objects)) nên phải chuyển về string để so sánh để tránh mất dữ liệu
      //toString() là của JavaScript
      //   (card) => card.columnId.toString() === column._id.toString()
      // );
      column.cards = resBoard.cards.filter(
        //C2: Sử dụng equals() vì chúng hiể ObjectID của mongoDB có supports equals() method để so sánh 2 ObjectID
        //equals() là của mongoDB
        (card) => card.columnId.equals(column._id)
      );
    });
    //B3: Xóa field cards ở board vì đã xử lý ở trên
    delete resBoard.cards;

    return resBoard;
  } catch (error) {
    throw error;
  }
};
const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedBoard = await boardModel.update(boardId, updateData);

    return updatedBoard;
  } catch (error) {
    throw error;
  }
};
const moveCardToDifferentColumn = async (reqBody) => {
  try {
    //  * B1: Cập nhật mảng cardOrderIds của column cũ (xóa cardId khỏi mảng cardOrderIds)
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now(),
    });
    //  * B2: Cập nhật mảng cardOrderIds của column mới (thêm cardId vào mảng cardOrderIds)
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now(),
    });
    //  * B3: cập nhật lại truong columnId mới của Card đã kéo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
      updatedAt: Date.now(),
    });
    return {
      updateResult: "Move card to different column successfully",
      data: reqBody,
    };
  } catch (error) {
    throw error;
  }
};
const getBoards = async (userId, page, itemsPerPage, queryFilters) => {
  try {
    // Nếu không tồn tại page hoặc itemsPerPage từ phía FE thì BE sẽ cần phải luôn gán giá trị mặc định
    if (!page) page = DEFAULT_PAGE;
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE;

    const results = await boardModel.getBoards(
      userId,
      parseInt(page, 10), // (value, hệ cơ số) hệ cơ số 10 là hệ cơ số thập phân
      parseInt(itemsPerPage, 10),
      queryFilters //queryFilters là object chứa các điều kiện lọc dữ liệu từ phía FE(search theo title...)
    );

    return results;
  } catch (error) {
    throw error;
  }
};
const addRecentlyViewedBoard = async (userId, boardId) => {
  try {
    const board = await boardModel.findOneById(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");
    }
    const user = await userModel.findOneById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    // Khởi tạo `recentlyViewed` nếu chưa tồn tại
    if (!user.recentlyViewed) {
      user.recentlyViewed = [];
    }
    // Kiểm tra nếu board đã tồn tại trong danh sách
    const existingIndex = user?.recentlyViewed?.findIndex(
      (item) => item.boardId.toString() === boardId
    );
    if (existingIndex >= 0) {
      // Nếu đã tồn tại thì cập nhật lại thời gian
      user.recentlyViewed[existingIndex].lastViewed = new Date();
    } else {
      if (user.recentlyViewed.length >= 8) {
        // Nếu đã đủ 8 phần tử thì xóa phần tử cuối cùng
        user.recentlyViewed.pop(); //Xóa phần tử cuối cùng
      }
      // Thêm vào đầu mảng
      user.recentlyViewed.unshift({
        boardId: boardId,
        lastViewed: new Date(),
      });
    }
    // Cập nhật lại vào DB
    await userModel.update(userId, {
      recentlyViewed: user.recentlyViewed,
    });
    // Fetch details for all boards in `recentlyViewed`
    const detailedRecentlyViewed = await Promise.all(
      user.recentlyViewed.map(async (item) => {
        const boardDetails = await boardModel.findOneById(item.boardId);
        return {
          ...item,
          board: boardDetails,
        };
      })
    );
    // Trả về kết quả với recentlyViewed bà kèm theo board
    return {
      recentlyViewed: detailedRecentlyViewed,
    };
  } catch (error) {
    throw error;
  }
};
const addStarBoard = async (userId, boardId) => {
  try {
    const board = await boardModel.findOneById(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");
    }
    const user = await userModel.findOneById(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    // Khởi tạo `starredBoards nếu chưa tồn tại
    if (!user.starredBoards) {
      user.starredBoards = [];
    }
    // Kiểm tra nếu board đã tồn tại trong danh sách
    // Kiểm tra xem board đã được gắn sao chưa
    const existingIndex = user.starredBoards.findIndex(
      (item) => item.boardId.toString() === boardId
    );
    if (existingIndex >= 0) {
      // Nếu đã tồn tại, xóa khỏi danh sách
      user.starredBoards.splice(existingIndex, 1);
    } else {
      // Nếu chưa tồn tại, thêm vào danh sách
      user.starredBoards.push({
        boardId: boardId,
        title: board.title,
        description: board.description,
        background: board.background,
      });
    }
    // Cập nhật lại vào DB
    await userModel.update(userId, {
      starredBoards: user.starredBoards,
    });
    // Trả về kết quả với starredBoards kèm theo board
    // Fetch details for all boards in `starredBoards`
    const detailedStarredBoards = await Promise.all(
      user.starredBoards.map(async (starredBoard) => {
        const boardDetails = await boardModel.findOneById(starredBoard.boardId);
        return {
          ...starredBoard,
          board: boardDetails,
        };
      })
    );
    return {
      starredBoards: detailedStarredBoards,
    };
  } catch (error) {
    throw error;
  }
};
const updateBackground = async (boardId, background) => {
  try {
    const board = await boardModel.findOneById(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");
    }
    const updatedBoard = await boardModel.update(boardId, {
      background,
    });
    return updatedBoard;
  } catch (error) {
    throw error;
  }
};
const updateBackgroundFromFile = async (boardId, background) => {
  try {
    const board = await boardModel.findOneById(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");
    }
    if (!background) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Background is required");
    }
    //Trường hợp upload file lên Cloud Storage, cụ thể là Cloudinary
    const uploadedResult = await CloudinaryProvider.streamUpload(
      background.buffer,
      "background_board"
    );
    //Lưu lại url (secure_url) của file ảnh vào db
    const updatedBoard = await boardModel.update(boardId, {
      background: uploadedResult.secure_url,
    });
    return updatedBoard;
  } catch (error) {
    throw error;
  }
};
const completionBoard = async (boardId) => {
  try {
    // Lấy thông tin board
    const board = await boardModel.findOneById(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");
    }

    // Lấy các column trong board
    const columns = await Promise.all(
      board.columnOrderIds.map((columnId) => {
        return columnModel.findOneById(columnId);
      })
    );
    let totalCards = 0;
    let completedCards = 0;
    let overDueCards = 0;
    const columnCompletion = [];

    // Duyệt qua các column để tính toán tỷ lệ hoàn thiện
    for (const column of columns) {
      // Lấy các card trong column dùng Promise.all để chờ tất cả các thông tin card được lấy về từ DB do nếu không có Promise.all thì DB trả về các promise <pending> và không thể lấy được dữ liệu
      const cards = await Promise.all(
        column.cardOrderIds.map((cardId) => {
          return cardModel.findOneById(cardId);
        })
      );
      const columnTotalCards = cards.length; //Số lượng card trong column
      //Số lượng card đã hoàn thành trong column
      const columnCompletedCards = cards.filter(
        (card) => card.isComplete
      ).length;
      const columnOverDueCards = cards.filter(
        (card) =>
          card.deadline &&
          new Date(card.deadline) < new Date() &&
          !card.isComplete //Kiểm tra xem deadline đã qua hay chưa
      ).length;
      if (columnOverDueCards > 0) {
        //Nếu có card quá hạn thì cập nhật trạng thái của column thành "overdue"
        overDueCards += columnOverDueCards;
      }
      //Tính tỷ lệ hoàn thiện của column
      totalCards += columnTotalCards;
      //Tính tỷ lệ hoàn thiện của board
      completedCards += columnCompletedCards;

      columnCompletion.push({
        columnId: column._id,
        columnTitle: column.title,
        totalCards: columnTotalCards,
        completedCards: columnCompletedCards,
        overDueCards: columnOverDueCards, //Số lượng card quá hạn
        completionRate:
          columnTotalCards === 0
            ? 0
            : Math.round((columnCompletedCards / columnTotalCards) * 100),
        overDueRate:
          columnTotalCards === 0
            ? 0
            : Math.round((columnOverDueCards / columnTotalCards) * 100),
      });
    }

    const boardCompletionRate =
      totalCards === 0 ? 0 : Math.round((completedCards / totalCards) * 100);
    const boardOverDueRate =
      totalCards === 0 ? 0 : Math.round((overDueCards / totalCards) * 100);

    return {
      boardId,
      boardTitle: board.title,
      totalCards,
      completedCards,
      overDueCards,
      completionRate: boardCompletionRate,
      overDueRate: boardOverDueRate,
      columnCompletion,
    };
  } catch (error) {
    throw error;
  }
};
const convertBoardToTemplate = async (userId, boardId) => {
  try {
    const board = await boardModel.getDetails(userId, boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");
    }
    const templateBoard = cloneDeep(board);
    //B2: Đưa card về đúng column
    templateBoard.columns.forEach((column) => {
      column.cards = templateBoard.cards.filter((card) =>
        card.columnId.equals(column._id)
      );
    });
    //B3: Xóa field cards ở board vì đã xử lý ở trên
    delete templateBoard.cards;
    const dataColumn = templateBoard.columns.map((column) => {
      return {
        title: column.title,
        cards: column.cards.map((card) => {
          return {
            title: card.title,
            description: card.description,
            cover: card.cover,
          };
        }),
      };
    });
    // Tạo mới template từ board
    const newTemplate = {
      title: board.title,
      description: board.description,
      background: board.background,
      userId: userId,
      type: "public",
      columns: [...dataColumn],
    };
    // Lưu template vào DB
    const temaplateNew = await templateModel.createTemplate(newTemplate);
    return {
      message: "Convert board to template successfully",
      templateId: temaplateNew.insertedId.toString(),
    };
  } catch (error) {
    throw error;
  }
};
export const boardService = {
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
