import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useDispatch } from "react-redux";
import {
  selectStarredBoards,
  toggleStarredBoardAPI,
} from "~/redux/user/userSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const CardTitle = ({ title, description, boardId, background }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const starredBoards = useSelector(selectStarredBoards);
  const handelStarStatus = (event) => {
    event.stopPropagation(); // Ngăn không cho sự kiện click ảnh hưởng đến Box cha
    //Gọi API cập nhật starredBoards
    dispatch(toggleStarredBoardAPI(boardId));
  };
  const star = starredBoards.some((board) => board.boardId === boardId);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "270px",
        height: "40px",
      }}
      onClick={() => {
        // Chuyển trang khi click vào Card
        navigate(`/boards/${boardId}`);
      }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            background: background?.startsWith("#")
              ? background
              : `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "40px",
            height: "40px",
            borderRadius: "10px",
          }}></Box>
        <Box sx={{ ml: 2 }}>
          <Box sx={{ fontSize: "14px", fontWeight: "500" }}>{title}</Box>
          <Box
            sx={{
              fontSize: "12px",
              fontWeight: "400",
              lineHeight: "16px",
              color: "#9FADBC",
            }}>
            {description}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{ ml: 1 }}
        // Ngăn chuyển trang khi nhấn vào IconButton
        onMouseDown={(event) => event.stopPropagation()}>
        <Button onClick={handelStarStatus} sx={{ p: 0, m: 0, minWidth: 0 }}>
          {star ? (
            <StarRoundedIcon sx={{ color: "#e8e809" }} />
          ) : (
            <StarBorderRoundedIcon sx={{ color: "#e8e809" }} />
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default CardTitle;
