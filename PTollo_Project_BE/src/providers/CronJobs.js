import cron from "node-cron";
import { GET_DB } from "~/config/mongodb";
import dayjs from "dayjs";
import { cardService } from "~/services/cardService";

// Hàm gửi thông báo qua Socket.IO
const sendNotification = (type, card, board) => {
  const message =
    type === "reminder"
      ? `Reminder: "${card.title}" of board "${board.title}" is ${dayjs(
          card.deadline
        ).fromNow()} due to deadline.`
      : `Deadline Passed: "${card.title}" of board "${board.title}" has expired.`;
  //dayjs(card.deadlin).fromNow() trả về thời gian còn lại đến deadline fromNow là để tính toán từ thời điểm hiện tại đến thời gian deadline
};
//Hàm gửi card và board qua cardService để xử lý
const sendCardAndBoard = async (card, board, type) => {
  await cardService.sendCardAndBoardDeadline(card, board, type);
};

// Job chạy mỗi phút kiểm tra reminderTime và deadline
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const db = GET_DB();

  try {
    // Lấy các thẻ cần thông báo reminder và deadline
    const cards = await db
      .collection("cards")
      .find({
        $or: [
          {
            // $lte: less than or equal "nhỏ hơn hoặc bằng"
            reminderTime: { $lte: now },
            // $gt: greater than "lớn hơn"
            deadline: { $gt: now },
            isComplete: false,
          }, // Reminder
          { deadline: { $lte: now }, isComplete: false }, // Deadline overdue (hết hạn)
        ],
      })
      .toArray();

    // Lấy thông tin board cho tất cả các card
    const boardIds = [...new Set(cards.map((card) => card.boardId))];
    const boards = await db
      .collection("boards")
      // Lấy ra các bảng có _id nằm trong mảng boardIds
      // $in: nếu _id nằm trong mảng boardIds thì lấy ra
      .find({ _id: { $in: boardIds.map((id) => id) } })
      .toArray();

    // Map boardId với thông tin board tương ứng
    // Ví dụ: { 'boardId1': { board1 }, 'boardId2': { board2 } }
    //Reduce để chuyển mảng boards thành một object với key là _id của board và value là thông tin của board
    const boardMap = boards.reduce((acc, board) => {
      //Chuyển _id của board thành string để so sánh với _id của card
      //acc là object trả về sau mỗi lần chạy reduce
      acc[board._id.toString()] = board;
      return acc;
    }, {});

    // Gửi thông báo cho từng thẻ
    cards.forEach((card) => {
      const board = boardMap[card.boardId.toString()];
      if (
        card.reminderTime &&
        card.reminderTime <= now &&
        card.deadline > now
      ) {
        // Thông báo reminder
        sendNotification("reminder", card, board);
        //Chuyển card và board sang cardService để xử lý
        sendCardAndBoard(card, board, "reminder");
      } else if (card.deadline && card.deadline <= now) {
        // Thông báo deadline hết hạn
        sendNotification("deadline", card, board);
        //Chuyển card và board sang cardService để xử lý
        sendCardAndBoard(card, board, "deadline");
      }
    });
  } catch (error) {
    throw new Error(error);
  }
});
