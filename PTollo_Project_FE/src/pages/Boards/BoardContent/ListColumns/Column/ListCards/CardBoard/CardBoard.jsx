import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Card as MuiCard } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import AttachmentIcon from "@mui/icons-material/Attachment";
import CommentIcon from "@mui/icons-material/Comment";
import GroupIcon from "@mui/icons-material/Group";
import CardActions from "@mui/material/CardActions";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import {
  updateCurrentActiveCard,
  showModalActiveCard,
} from "~/redux/activeCard/activeCardSlice";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
//dnd-kit
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { updateCardDetailsAPI } from "~/apis";
import Card from "antd/es/card/Card";
import { updateCardInBoard } from "~/redux/activeBoard/activeBoardSlice";
const label = { inputProps: { "aria-label": "Checkbox demo" } };
const CardBoard = ({ card }) => {
  const dispatch = useDispatch();
  const [chipStatus, setChipStatus] = useState({
    color: "default",
    text: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [hover, setHover] = useState(false);
  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => setHover(false);

  // Cập nhật trạng thái `Chip` dựa trên thời gian
  useEffect(() => {
    if (!card?.deadline) return;
    const now = dayjs();
    if (card.isComplete) {
      setChipStatus({ color: "success", text: "Complete" });
      setIsChecked(true);
    } else if (card.isComplete === false) {
      setIsChecked(false);
      if (now.isAfter(card?.deadline)) {
        setChipStatus({ color: "error", text: "Overdue" });
      } else if (
        now.isAfter(card?.reminderTime) &&
        now.isBefore(card?.deadline)
      ) {
        setChipStatus({ color: "warning", text: "Due Soon" });
      } else {
        setChipStatus({ color: "default", text: "" });
      }
    }
  }, [isChecked, card, card?.deadline, card?.reminderTime]);
  const handleCheckboxChange = async (event) => {
    setIsChecked(event.target.checked);
    if (event.target.checked) {
      const updateData = await updateCardDetailsAPI(card._id, {
        isComplete: true,
      });
      if (updateData) {
        dispatch(updateCurrentActiveCard(updateData));
        dispatch(updateCardInBoard(updateData));
      }
    } else if (event.target.checked === false) {
      const updateData = await updateCardDetailsAPI(card._id, {
        isComplete: false,
      });
      if (updateData) {
        dispatch(updateCurrentActiveCard(updateData));
        dispatch(updateCardInBoard(updateData));
      }
    }
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id, data: { ...card } });
  const dndKitCardStyles = {
    /**
     * Nếu sử dụng CSS.Transform như docs sẽ bị lỗi kiểu stretch
     */
    // touchAction: "none",//dùng cho sensor PointerSensor
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? "2px solid #fd79a8" : undefined,
  };

  const showCardAction = () => {
    return (
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.attachments?.length
    );
  };
  const setActiveCardToRedux = () => {
    //Cập nhật data cho activeCard trong redux
    dispatch(updateCurrentActiveCard(card));
    //Hiện Moidal ActiveCard lên
    dispatch(showModalActiveCard());
  };
  return (
    <MuiCard
      //Kiểm tra xem đã click vào card chưa để mở active card
      onClick={setActiveCardToRedux}
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
      sx={{
        cursor: "pointer",
        boxShadow: "0 1px 1px rgba(0,0,0,.5)",
        overflow: "unset",
        display: card?.FE_PlaceholderCard ? "none" : "block",
        border: "1px solid transparent",
        "&:hover": { border: "1px solid #fd79a8" },
        //overflow: card?.FE_PlaceholderCard ? "hidden" : "unset",
        //height: card?.FE_PlaceholderCard ? "0" : "unset",
      }}>
      {card?.cover && (
        <CardMedia
          sx={{ height: 140 }}
          image={card?.cover}
          title="green iguana"
        />
      )}
      <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
        <Typography
          sx={{
            fontSize: "0.875rem",
          }}>
          {card?.title}
        </Typography>
      </CardContent>
      {showCardAction && (
        <CardActions
          sx={{
            p: "0 0px 8px 0px",
          }}>
          {!!card?.deadline?.length && (
            <Button
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              sx={{
                bgcolor:
                  chipStatus.color === "error"
                    ? "error.main"
                    : chipStatus.color === "warning"
                      ? "warning.main"
                      : chipStatus.color === "success"
                        ? "success.main"
                        : "default",
                color: "text.primary",
                width: "65px",
                height: "24px",
                borderRadius: "12px",
                border: "1px solid",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ml: "1px",
              }}>
              {hover ? (
                <Checkbox
                  sx={{
                    width: "10px",
                    height: "10px",
                    mr: "1px",
                  }}
                  {...label}
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
              ) : (
                <WatchLaterOutlinedIcon
                  sx={{
                    width: "12px",
                    height: "12px",
                    mr: "1px",
                  }}
                />
              )}
              <Typography
                sx={{
                  fontSize: "8px",
                  fontWeight: "500",
                }}>
                {dayjs(card?.deadline).format("MMM DD")}
              </Typography>
            </Button>
          )}
          {!!card?.memberIds?.length && (
            <Button
              sx={{
                width: "63px",
                height: "30px",
                px: "2px",
                m: "0px",
              }}
              startIcon={<GroupIcon />}>
              {card?.memberIds?.length}
            </Button>
          )}
          {!!card?.comments?.length && (
            <Button
              sx={{
                width: "63px",
                height: "30px",
                px: "2px",
                m: "0px",
              }}
              startIcon={<CommentIcon />}>
              {card?.comments?.length}
            </Button>
          )}
          {!!card?.attachments?.length && (
            <Button
              sx={{
                width: "63px",
                height: "30px",
                px: "2px",
                m: "0px",
              }}
              startIcon={<AttachmentIcon />}>
              {card?.attachments?.length}
            </Button>
          )}
        </CardActions>
      )}
    </MuiCard>
  );
};

export default CardBoard;
