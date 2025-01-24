/**
 * namnguyen
 * (115.78.229.197
 */

import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "~/config/environment";

//Khởi tạo đối tượng ptolloDatatbaseInstance ban đầu là null (vì ta chưa kết nối đến cơ sở dữ liệu)
let ptolloDatatbaseInstance = null;

//Khởi tạo đối tượng mongoClient để kết nối đến mongodb
const mongoClient = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//Hàm kết nối đến cơ sở dữ liệu
export const CONNECT_DB = async () => {
  //gọi kết nối đến mongodb Atlas với URI đã khai báo trong thân mongoClient
  await mongoClient.connect();

  //Kết nối thành công thì lấy ra Database có tên là DATABASE_NAME và gán ngược nó lại cho ptolloDatatbaseInstance
  ptolloDatatbaseInstance = mongoClient.db(env.DATABASE_NAME);
};

//Function này có nhiệm vụ ẽ trả về đối tượng ptolloDatatbaseInstance sau khi đã kết nối thành công với mongodb để sử dụng ở nhiều nơi khác trong code
//Lưu ý phải đảm bảo chỉ luôn gọi GET_DB() sau khi đã kết nối thành công với mongodb
export const GET_DB = () => {
  if (!ptolloDatatbaseInstance) throw new Error("Database not connected!");
  return ptolloDatatbaseInstance;
};

//Đóng kết nối đến mongodb khi cần
export const CLOSE_DB = async () => {
  await mongoClient.close();
};
