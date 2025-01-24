import Avatar from "@mui/material/Avatar";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  selectStarredBoards,
  toggleStarredBoardAPI,
} from "~/redux/user/userSlice";
import { useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";

const CardSmall = ({ title, description, boardId, background }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleStarStatus = (event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện click lan đến Box bên ngoài
    dispatch(toggleStarredBoardAPI(boardId));
  };
  const starredBoards = useSelector(selectStarredBoards);
  const showStar = starredBoards.some((board) => board.boardId === boardId);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "270px",
        height: "40px",
      }}
      onMouseEnter={() => setIsHovered(true)} // Hiển thị icon khi hover
      //star là false thì ẩn icon và !star là true thì thực hiện hàm setShowStar(false) nghĩa là ẩn icon
      //star là true thì hiện icon và !star là false thì không thực hiện hàm setShowStar(false) nghĩa là không ẩn icon
      onMouseLeave={() => setIsHovered(false)} // Ẩn icon nếu chưa bấm
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
          <Box
            sx={{
              fontSize: "14px",
              fontWeight: "500",
              width: "290px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
            {title}
          </Box>
          <Box
            sx={{
              fontSize: "12px",
              fontWeight: "400",
              lineHeight: "16px",
              color: "#9FADBC",
              width: "290px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
            {description}
          </Box>
        </Box>
      </Box>
      {/* Hiển thị nút icon dựa trên hover hoặc khi đã bấm */}
      {isHovered && (
        <Box // Không chuyển trang khi click vào IconButton
          onMouseDown={(event) => event.stopPropagation()}>
          <IconButton onClick={handleStarStatus} sx={{ cursor: "pointer" }}>
            {showStar ? (
              <StarRoundedIcon sx={{ color: "yellow" }} />
            ) : (
              <StarBorderRoundedIcon sx={{ color: "white" }} />
            )}
          </IconButton>
        </Box>
      )}
      {showStar && !isHovered && (
        <Box // Không chuyển trang khi click vào IconButton
          onMouseDown={(event) => event.stopPropagation()}>
          <IconButton onClick={handleStarStatus} sx={{ cursor: "pointer" }}>
            {showStar ? (
              <StarRoundedIcon sx={{ color: "yellow" }} />
            ) : (
              <StarBorderRoundedIcon sx={{ color: "white" }} />
            )}
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default CardSmall;
