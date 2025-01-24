/**
 * namnguyen
 */
import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { BOARD_TYPES } from "~/utils/constants";
import { columnModel } from "./columnModel";
import { cardModel } from "./cardModel";
import { pagingSkipValue } from "~/utils/algorithms";
import { userModel } from "./userModel";
// import { verify } from "jsonwebtoken";

// Define Collection (name & schema)
const BOARD_COLLECTION_NAME = "boards";
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  background: Joi.string().default(null),

  /**
   * Tips: Thay vì gọi lần lượt tất cả type của board để cho vào hàm valid() thì có thể viết gọn lại bằng Object.values() kết hợp Spread Operator của JS. Cụ thể: .valid(...Object.values(BOARD_TYPES))
   * Làm như trên thì sau này dù các bạn có thêm hay sửa gì vào cái BOARD_TYPES trong file constants thì ở những chỗ dùng Joi trong Model hay Validation cũng không cần phải đụng vào nữa. Tối ưu gọn gàng luôn.
   */
  // type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
  type: Joi.string()
    .required()
    .valid(...Object.values(BOARD_TYPES)),

  //   type: Joi.string().required().valid("public", "private").trim().strict(),
  //   ownerIds: Joi.array().items(Joi.string()).required(),
  //   memberIds: Joi.array().items(Joi.string()).required(),

  // Lưu ý các item trong mảng columnOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé
  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  //Những admin của board
  ownerIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  //Những thành viên của board
  memberIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});
//chỉ ra các field(trường) không được phép cập nhật trong hàm update
const INVALIB_UPDATE_FIELDS = ["_id", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (userId, data) => {
  try {
    // const createdBoard = await GET_DB()
    //   .collection(BOARD_COLLECTION_NAME)
    //   .insertOne(data);
    // return createdBoard;
    const validatedData = await validateBeforeCreate(data);
    const newBoardToAdd = {
      ...validatedData,
      ownerIds: [new ObjectId(userId)],
    };

    //validatedData sẽ chứa dữ liệu đã được validate từ Joi và có thêm các giá trị default
    return await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .insertOne(newBoardToAdd);
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (boardId) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(boardId),
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
//Query tổng hợp (aggregate) để lấy thông tin chi tiết của Collection(table) là Column và Card thuộc về Board
//aggregate này sẽ join 3 Collection lại với nhau để giống mysql
const getDetails = async (userId, boardId) => {
  try {
    // const result = await GET_DB()
    //   .collection(BOARD_COLLECTION_NAME)
    //   .findOne({ _id: new ObjectId(boardId) });
    //queryConditions là mảng chứa các điều kiện để lọc ra boardId cần tìm và userId phải thuộc vào ownerIds hoặc memberIds của board đó mới được phép lấy ra thông tin của board đó (tương tự như điều kiện ở hàm getBoards) nếu không thì sẽ không được phép lấy ra thông tin của board đó và trả về null (không tìm thấy) hoặc throw error (lỗi)
    const queryConditions = [
      { _id: new ObjectId(boardId) },
      { _destroy: false },
      {
        $or: [
          { ownerIds: { $all: [new ObjectId(userId)] } },
          { memberIds: { $all: [new ObjectId(userId)] } },
        ],
      },
    ];
    //aggregate để join 3 Collection lại với nhau để lấy thông tin chi tiết của Collection(table) là Column và Card thuộc về Board (tương tự như join 3 bảng trong mysql) và trả về 1 object chứa thông tin chi tiết của board đó (tương tự như 1 bảng trong mysql) nếu không tìm thấy thì trả về null
    //result sẽ trả về 1 mảng chứa thông tin chi tiết của board đó nếu tìm thấy và trả về null nếu không tìm thấy (nếu không tìm thấy thì sẽ không có phần tử nào trong mảng) nên cần phải lấy phần tử đầu tiên của mảng đó để trả về 1 object chứa thông tin chi tiết của board đó
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: { $and: queryConditions },
        },
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: "_id", //Primary key của Board và chúng đều là boardId
            foreignField: "boardId", //Foreign key của Column (là khóa chính của Board) (Khóa ngoại tham chiếu đến collection Board)
            as: "columns", //Tên của field mà nó sẽ trả về do ta tự đặt
          },
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: "_id", //Primary key của Board và chúng đều là boardId
            foreignField: "boardId", //Foreign key của Column (là khóa chính của Board) (Khóa ngoại tham chiếu đến collection Board)
            as: "cards",
          },
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: "ownerIds", //Primary key của Board và chúng đều là boardId
            foreignField: "_id", //Foreign key của Column (là khóa chính của Board) (Khóa ngoại tham chiếu đến collection Board)
            as: "owners", //Tên của field mà nó sẽ trả về do ta tự đặt
            //pineline trong lookup để xử lý 1 or nhiều luồng cần thiết
            //$project để chỉ định vài field không muốn lấy về bằng cách gán nó bằng 0
            pipeline: [{ $project: { password: 0, verifyToken: 0 } }],
          },
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: "memberIds", //Primary key
            foreignField: "_id", //Foreign key
            as: "members", //Tên của field mà nó sẽ trả về do ta tự đặt
            pipeline: [{ $project: { password: 0, verifyToken: 0 } }],
          },
        },
      ])
      .toArray();
    //return về 1 object mà nó trả về thì chỉ trả về 1 board thôi nghĩa là chỉ trả về 1 phần tử nên sẽ lấy phần tử đầu tiên
    return result[0] || null;
  } catch (error) {
    throw new Error(error);
  }
};
//Hàm này sẽ push 1 columnId vào cuối mảng columnOrderIds trong collection boards
const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        //Tìm kiếm boardId trong collection boards để push columnId vào cuối mảng columnOrderIds
        {
          _id: new ObjectId(column.boardId),
        },
        { $push: { columnOrderIds: new ObjectId(column._id) } },
        //Trả về dữ liệu sau khi đã update, mặc định nếu không có thì sẽ trả về dữ liệu trước khi update dù đã update thành công
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
//Lấy 1 phần tử columnId ra khỏi mảng columnOrderIds trong collection boards
//Dùng $pull trong mongodb ở trường hợp này để lấy ra 1 phần tử trong mảng rồi xóa nó
const pullColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        //Tìm kiếm boardId trong collection boards để push columnId vào cuối mảng columnOrderIds
        {
          _id: new ObjectId(column.boardId),
        },
        { $pull: { columnOrderIds: new ObjectId(column._id) } },
        //Trả về dữ liệu sau khi đã update, mặc định nếu không có thì sẽ trả về dữ liệu trước khi update dù đã update thành công
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

//
const update = async (boardId, updateData) => {
  try {
    //Lọc ra các field không được phép update
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALIB_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });
    //Đối với những những dữ liệu cần update như ObjectId thì cần phải chuyển từ string sang ObjectId
    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map(
        (id) => new ObjectId(id)
      );
    }
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        //Tìm kiếm boardId trong collection boards để push columnId vào cuối mảng columnOrderIds
        {
          _id: new ObjectId(boardId),
        },
        { $set: updateData },
        //Trả về dữ liệu sau khi đã update, mặc định nếu không có thì sẽ trả về dữ liệu trước khi update dù đã update thành công
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const getBoards = async (userId, page, itemsPerPage, queryFilters) => {
  try {
    const queryConditions = [
      //Điều kiện 01: Board chưa bị xóa
      { _destroy: false },
      //Điều kiện 02: bài thằng userId đang thực hiện request này nó phải thuộc vào 1 trong 2 trường ownerIds hoặc memberIds, sử dụng toán tử $all của mongodb để kiểm tra xem userId có tồn tại trong mảng ownerIds hoặc memberIds không
      {
        //Nếu userId tồn tại trong mảng ownerIds hoặc memberIds thì được phép lấy ra board đó
        //$all: toán tử của mongodb để kiểm tra xem userId có tồn tại trong mảng ownerIds hoặc memberIds không nếu có thì trả về true
        $or: [
          { ownerIds: { $all: [new ObjectId(userId)] } },
          { memberIds: { $all: [new ObjectId(userId)] } },
        ],
      },
    ];

    //Xử lý query filter cho từng trường hợp search board, vd: search theo title...
    if (queryFilters) {
      // console.log(Object.keys(queryFilters));
      Object.keys(queryFilters).forEach((key) => {
        //Có phân biệt chữ hoa chữ thường
        // queryConditions.push({ [key]: { $regex: queryFilters[key] } });
        //Không phân biệt chữ hoa chữ thường
        queryConditions.push({
          [key]: { $regex: new RegExp(queryFilters[key], "i") },
        });
      });
    }
    const query = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate(
        [
          //%and: toán tử của mongodb để kết hợp nhiều điều kiện lại với nhau (tương tự && trong lập trình)
          //%match: để lọc ra những bản ghi thỏa dk của $and (tương tự như where trong sql) và trả về những bản ghi
          { $match: { $and: queryConditions } },
          //$sort: sắp xếp theo title theo A-Z (mặc định sẽ bị chữ B hoa đứng trước a thường) nên cần thêm options để sắp xếp theo thứ tự A-Z
          { $sort: { title: 1 } },
          //$facet để xử lý nhiều luồng dữ liệu trong 1 query
          {
            $facet: {
              //Luồng 1: query boards
              queryBoards: [
                //%skip: bỏ qua số lượng bản ghi của những page trước đó
                { $skip: pagingSkipValue(page, itemsPerPage) },
                //%limit: giới hạn tối đa só lượng bản ghi trả về trên 1 page
                { $limit: itemsPerPage },
              ],
              //Luồng 2: query đếm tổng tất cả số lượng bản ghi boards trong và trả về tổng số lượng bản ghi vào biến countedAllBoards
              queryTotalBoards: [
                //%count: đếm số lượng bản ghi
                { $count: "countedAllBoards" },
              ],
            },
          },
        ],
        //Khai báo thêm thuốc tính collation local "en" để bĩ vụ B hoa đứng trước a thường
        {
          collation: { locale: "en" },
        }
      )
      .toArray();

    //Trả về 1 object
    const res = query[0];

    return {
      //Trả về 1 mảng boards
      boards: res.queryBoards || [],
      //Trả về tổng số lượng bản ghi boards
      //queryTotalBoards[0] sẽ trả về 1 object nên cần phải lấy ra giá trị của key countedAllBoards và mảng queryTotalBoards có 1 phần tử nên cần phải lấy phần tử đầu tiên
      totalBoards: res.queryTotalBoards[0]?.countedAllBoards || 0,
    };
  } catch (error) {
    throw new Error(error);
  }
};
const pushMemberIds = async (boardId, userId) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        //Tìm kiếm boardId trong collection boards để push columnId vào cuối mảng columnOrderIds
        {
          _id: new ObjectId(boardId),
        },
        { $push: { memberIds: new ObjectId(userId) } },
        //Trả về dữ liệu sau khi đã update, mặc định nếu không có thì sẽ trả về dữ liệu trước khi update dù đã update thành công
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  pullColumnOrderIds,
  update,
  getBoards,
  pushMemberIds,
};
