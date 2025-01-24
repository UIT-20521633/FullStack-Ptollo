/**
 * namnguyen
 */

import express from "express";
import cors from "cors";
import { corsOptions } from "~/config/cors";
import exitHook from "async-exit-hook";
import { CONNECT_DB, CLOSE_DB } from "~/config/mongodb";
import { env } from "~/config/environment";
import { APIs_V1 } from "~/routes/v1";
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware";
import cookieParser from "cookie-parser";
// import "~/providers/CronJobs"; //import file này để chạy cron job khi server chạy
// Xử lý socket real-time với gói socket.io
// https://socket.io/get-started/chat/#integrating-socketio
import http from "http";
import socketIo from "socket.io";
import { invateUserToBoardSocket } from "./sockets/invateUserToBoardSocket";
const START_SERVER = () => {
  const app = express();
  //Lưu thông tin socketId của user online
  global.userSocketMap = {}; //{userId: socketId}
  //Fix cache from disk của ExpressJS
  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

  //Cấu hình sử dụng cookie-parser
  app.use(cookieParser());

  app.use(cors(corsOptions));

  //enable req.body json data
  app.use(express.json());

  //sử dùng APIs_V1 cho tất cả các request bắt đầu bằng /v1
  app.use("/v1", APIs_V1);

  //Middleware xử lý lỗi tâp trung
  app.use(errorHandlingMiddleware);

  //Tạo server HTTP để sử dụng socket.io, ta sẽ bọc app của express để làm realtime trên socket.io
  const server = http.createServer(app);
  //Khởi tạo biến io với server và cors
  global.io = socketIo(server, {
    cors: corsOptions,
  });

  global.io.on("connection", (socket) => {
    const { userId } = socket.handshake.query;
    if (userId) global.userSocketMap[userId] = socket.id;

    //io.emit() dùng để gửi tới tất cả các client đang kết nối
    global.io.emit("getOnlineUsers", Object.keys(global.userSocketMap));
    //Gọi socket tùy vào tính năng cụ thể
    // Khi user kết nối, lưu lại thông tin socketId
    //Nhận dữ liệu từ client gửi lên

    invateUserToBoardSocket(socket);
    // sendRoomIdToUsers(socket, io);
    socket.on("disconnect", () => {
      //Xóa thông tin socketId của user khi user disconnect
      delete global.userSocketMap[userId];
      global.io.emit("getOnlineUsers", Object.keys(global.userSocketMap));
    });
  });
  //Nếu môi trường là production (support reder.com)
  if (env.BUILD_MODE === "production") {
    //dùng server.listen thay app.listen vì lúc này server đã gồm express app và config socket.io
    server.listen(process.env.PORT, () => {
      console.log(
        `3. Production: Hello ${env.AUTHOR}, Back-end server is running successfully at Port: ${process.env.PORT}/`
      );
    });
  } else {
    //Chỉ chạy ở môi trường development
    //dùng server.listen thay app.listen vì lúc này server đã gồm express app và config socket.io
    server.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(
        `3.Local DEV: Hello ${env.AUTHOR}, Back-end server is running successfully at Host: http://${env.LOCAL_DEV_APP_HOST} Port: ${env.LOCAL_DEV_APP_PORT}/`
      );
    });
  }

  //thực hiện các tác vụ clean up trước khi thoát ứng dụng
  exitHook(() => {
    console.log("4. Closing MongoDB connection...");
    CLOSE_DB();
    console.log("5. MongoDB connection closed");
  });
};

//Cách 2:
//Nó sẽ trả về một promise, nếu kết nối thành công thì then, ngược lại catch
//Chỉ khi nào kết nối thành công thì mới chạy hàm START_SERVER()
//Immediately Invoked/ Anonymous Async Function Expression (IIFE)
(async () => {
  try {
    console.log("1. Connecting to MongoDB...");
    await CONNECT_DB();
    console.log("2. Connected to MongoDB");
    //Khởi động Server BE sau khi connect DB thành công
    START_SERVER();
  } catch (err) {
    console.error(err);
    process.exit(0);
  }
})();

//Nó sẽ trả về một promise, nếu kết nối thành công thì then, ngược lại catch
//Chỉ khi nào kết nối thành công thì mới chạy hàm START_SERVER()
//Cách1:
// console.log("1. Connecting to MongoDB...");
// CONNECT_DB()
//   .then(() => console.log("2. Connected to MongoDB"))
//   .then(() => START_SERVER())
//   .catch((err) => {
//     console.error(err);
//     process.exit(0);
//   });
