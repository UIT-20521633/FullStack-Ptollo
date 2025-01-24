import { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";

// Một Trick xử lý css khá hay trong việc làm UI UX khi cần ẩn hiện một cái input: Hiểu đơn giản là thay vì phải tạo biến State để chuyển đổi qua lại giữa thẻ Input và Text thông thường thì chúng ta sẽ CSS lại cho cái thẻ Input trông như text bình thường, chỉ khi click và focus vào nó thì style lại trở về như cái input ban đầu.
// Controlled Component Input trong MUI: https://mui.com/material-ui/react-text-field/#uncontrolled-vs-controlled
function ToggleFocusInputBoard({
  value,
  onChangedValue,
  inputFontSize = "20px",
  ...props
}) {
  const [inputValue, setInputValue] = useState(value);
  const [inputWidth, setInputWidth] = useState(0);
  const canvasRef = useRef(null);
  // Đồng bộ inputValue với value khi value thay đổi
  useEffect(() => {
    setInputValue(value); // Cập nhật inputValue khi value từ props thay đổi
  }, [value]);
  // Hàm tính toán chiều rộng của văn bản
  const calculateWidth = (text) => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas"); // Tạo một canvas để vẽ text và tính toán chiều rộng
    }
    const context = canvasRef.current.getContext("2d"); // Lấy context 2D của canvas để vẽ text và tính toán chiều rộng
    context.font = `${inputFontSize} Roboto, sans-serif`; // Font phải giống với font của TextField
    // Thêm padding 16px cho TextField (8px ở 2 bên)
    //width chỉ được phép lớn nhỏ hơn 250px
    return Math.min(context.measureText(text || " ").width + 16, 250); // Thêm padding 16px cho TextField (8px ở 2 bên) và giới hạn chiều rộng tối đa là 250px
  };

  useEffect(() => {
    setInputWidth(calculateWidth(inputValue));
  }, [inputValue, inputFontSize]);
  // Blur là khi chúng ta không còn Focus vào phần tử nữa thì sẽ trigger hành động ở đây.
  const triggerBlur = () => {
    // Support Trim cái dữ liệu State inputValue cho đẹp luôn sau khi blur ra ngoài
    setInputValue(inputValue.trim());
    // Nếu giá trị không có gì thay đổi hoặc Nếu user xóa hết nội dung thì set lại giá trị gốc ban đầu từ props và return luôn không làm gì thêm
    if (!inputValue || inputValue.trim() === value) {
      setInputValue(value);
      return;
    }
    // console.log('value: ', value)// giá trị ban đầu
    // console.log('inputValue: ', inputValue)// giá trị sau khi thay đổi
    // Khi giá trị có thay đổi ok thì gọi lên func ở Props cha để xử lý
    onChangedValue(inputValue);
  };
  return (
    <TextField
      id="toggle-focus-input-controlled"
      variant="outlined"
      size="small"
      value={inputValue}
      onChange={(event) => {
        setInputValue(event.target.value);
      }}
      onBlur={triggerBlur}
      {...props}
      // Magic here :D
      sx={{
        width: inputWidth,
        "& label": {},
        "& input": { fontSize: inputFontSize, fontWeight: "bold" },
        "& .MuiOutlinedInput-root": {
          backgroundColor: "transparent",
          "& fieldset": { borderColor: "transparent" },
        },
        "& .MuiOutlinedInput-root:hover": {
          borderColor: "transparent",
          "& fieldset": { borderColor: "transparent" },
        },
        "& .MuiOutlinedInput-root.Mui-focused": {
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#33485D" : "white",
          "& fieldset": { borderColor: "primary.main" },
        },
        "& .MuiOutlinedInput-input": {
          px: "6px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        },
      }}
    />
  );
}

export default ToggleFocusInputBoard;
