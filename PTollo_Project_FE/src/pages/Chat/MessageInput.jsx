import { useState, useRef } from "react";
import "~/index.css";
import { Image, Send, X } from "lucide-react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedUser, sendMessage } from "~/redux/Chats/chatSlice";
import { selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setimagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const currentBoard = useSelector(selectCurrentActiveBoard);

  const handleImgChange = (e) => {
    // Xử lý khi chọn ảnh từ máy
    const file = e.target.files[0]; // Lấy file ảnh từ input file
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    // Hiển thị ảnh trước khi gửi
    // reader.onloadend sẽ được gọi khi quá trình đọc file hoàn tất và trả về kết quả dưới dạng base64 string (được lưu trong reader.result)
    // Khi đó, setimagePreview sẽ được gọi để cập nhật ảnh preview trên giao diện người dùng dựa vào base64 string trả về
    reader.onloadend = () => {
      setimagePreview(reader.result);
    };
    // Đọc file ảnh dưới dạng base64 string (để hiển thị ảnh trước khi gửi)
    reader.readAsDataURL(file);
  };

  const removeImg = () => {
    // Xóa ảnh
    console.log(fileInputRef.current);
    setimagePreview(null);
    // Reset input file để có thể chọn lại ảnh mới
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMsg = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form

    // Kiểm tra nếu không có text hoặc ảnh
    if (!text.trim() && !imagePreview) {
      toast.error("Please enter a message or select an image.");
      return;
    }

    let reqData = new FormData();
    if (text.trim()) {
      reqData.append("text", text.trim()); // Luôn thêm text vào FormData
    }
    // Nếu có ảnh, thêm ảnh vào FormData
    if (fileInputRef.current?.files[0]) {
      reqData.append("image", fileInputRef.current.files[0]);
    }
    //Gửi tin nhắn kèm boardId
    reqData.append("boardId", currentBoard._id);
    try {
      dispatch(sendMessage(reqData));
      // Xóa input sau khi gửi
      fileInputRef.current.value = "";
      setText("");
      setimagePreview(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Box
      sx={{
        pt: 2,
        width: "100%",
      }}>
      {/* Image Preview */}
      {imagePreview && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 1,
          }}>
          <Box sx={{ position: "relative" }}>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <IconButton
              onClick={removeImg}
              sx={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                width: "26px",
                height: "26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className="rounded-full bg-base-300"
              type="button">
              <X className="size-4" />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Form Input */}
      <form onSubmit={handleSendMsg} className="flex items-center gap-2">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flex: 1,
          }}>
          {/* Text Input */}
          <TextField
            variant="outlined"
            size="small"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{
              width: "100%",
              borderRadius: "10px",
            }}
          />

          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImgChange}
          />

          {/* File Button */}
          <IconButton
            type="button"
            // kích hoạt hộp thoại chọn file khi click vào nút
            onClick={() => fileInputRef.current?.click()}
            className={`hidden btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }
            `}>
            <Image size={22} />
          </IconButton>
        </Box>

        {/* Send Button */}
        <IconButton
          type="submit"
          className="btn btn-circle"
          disabled={!text.trim() && !imagePreview}>
          <Send size={22} />
        </IconButton>
      </form>
    </Box>
  );
};

export default MessageInput;
