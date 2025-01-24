import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
// import CardMedia from '@mui/material/CardMedia'
import { Link } from "react-router-dom";
// import randomColor from "randomcolor";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import { useDispatch } from "react-redux";
import {
  selectStarredBoards,
  toggleStarredBoardAPI,
} from "~/redux/user/userSlice";
import { useSelector } from "react-redux";
import {
  fetchCompletionBoardAPI,
  selectCompletionBoard,
} from "~/redux/activeBoard/activeBoardSlice";
const CardComponentBoard = ({ title, description, boardId, background }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const starredBoards = useSelector(selectStarredBoards);
  // Kiểm tra xem board có được gắn sao hay không dù bạn đang ở your boards hay starred boards hay recently viewed boards
  //some: trả về true nếu có ít nhất 1 phần tử trong mảng thỏa mã
  const isMarked = starredBoards.some((board) => board.boardId === boardId);
  const handleToggleMark = () => {
    //Gọi API cập nhật starredBoards
    dispatch(toggleStarredBoardAPI(boardId));
  };
  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ width: "230px", position: "relative" }}>
      {/* Ý tưởng mở rộng về sau làm ảnh Cover cho board nhé */}
      {background?.startsWith("#") ? (
        <Box
          sx={{
            height: "50px",
            backgroundColor: { background },
            width: "100%",
            position: "relative",
          }}></Box>
      ) : (
        <Box sx={{ height: "50px" }}>
          <CardMedia component="img" image={background} />
        </Box>
      )}
      <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
        {/* nếu title có width lớn hơn 206 thì hiển thị ... ở cuối title */}
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            width: "100%",
          }}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}>
          {description}
        </Typography>
        <Box>
          {/* Star icon here */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: -100,
              width: "40%",
              height: "100%",
              borderRadius: "10px",
              transform: isHovered ? "translateX(100%)" : "translateX(0)",
              transition: "transform 0.3s ease-in-out",
              zIndex: 1,
            }}>
            <Box
              sx={{
                position: "absolute",
                bottom: "5px",
                left: "5px",
                zIndex: 2,
              }}>
              <IconButton onClick={handleToggleMark} sx={{ cursor: "pointer" }}>
                {isMarked ? (
                  <StarRoundedIcon sx={{ color: "yellow" }} />
                ) : (
                  <StarBorderRoundedIcon sx={{ color: "white" }} />
                )}
              </IconButton>
            </Box>
          </Box>
          {isMarked && !isHovered && (
            <Box
              sx={{
                position: "absolute",
                bottom: "5px",
                left: "5px",
                zIndex: 2,
              }}>
              <IconButton onClick={handleToggleMark} sx={{ cursor: "pointer" }}>
                {isMarked ? (
                  <StarRoundedIcon sx={{ color: "yellow" }} />
                ) : (
                  <StarBorderRoundedIcon sx={{ color: "white" }} />
                )}
              </IconButton>
            </Box>
          )}
          <Box
            component={Link}
            to={`/boards/${boardId}`}
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              color: "primary.main",
              "&:hover": { color: "primary.light" },
            }}>
            Go to board <ArrowRightIcon fontSize="small" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardComponentBoard;
