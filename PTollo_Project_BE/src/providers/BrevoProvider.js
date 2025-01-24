/**
 * namnguyen
 */
// Lưu ý Brevo là tên thương hiệu mới của sib - Sendinblue
// https://github.com/getbrevo/brevo-node
const brevo = require("@getbrevo/brevo");
import { env } from "~/config/environment";

/**
 * Có thể xem thêm phần docs cấu hình theo từng ngôn ngữ khác nhau tùy dự án ở Brevo Dashboard > Account > SMTP & API > API Keys
 * https://brevo.com
 * Với Nodejs thì tốt nhất cứ lên github repo của bọn nó là nhanh nhất:
 * https://github.com/getbrevo/brevo-node
 */
let apiInstance = new brevo.TransactionalEmailsApi();
let apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = env.BREVO_API_KEY;

const sendEmail = async (toEmail, customSubject, htmlContent) => {
  //Khởi tạo 1 cái sendSmtpEmail với các thông tin cần thiết
  let sendSmtpEmail = new brevo.SendSmtpEmail();

  //Tài khoản gửi email: là địa chỉ admin email của bạn được tạo ra từ Brevo
  sendSmtpEmail.sender = {
    email: env.ADMIN_EMAIL_ADDRESS,
    name: env.ADMIN_EMAIL_NAME,
  };
  //Những người nhận email
  //'to' là một mảng chứa các địa chỉ email để sau này có thể gửi 1 email tới nhiều user cùng 1 lúc
  sendSmtpEmail.to = [{ email: toEmail }];

  //Tiêu đề của email
  sendSmtpEmail.subject = customSubject;

  //Nội dung của email
  sendSmtpEmail.htmlContent = htmlContent;

  //Gọi hành động gửi email
  return apiInstance.sendTransacEmail(sendSmtpEmail); //Trả về một promise có thể then hoặc catch
};
export const BrevoProvider = {
  sendEmail,
};
