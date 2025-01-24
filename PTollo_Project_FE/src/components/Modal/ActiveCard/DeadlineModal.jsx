import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import { styled } from "@mui/material/styles";
import { Divider } from "@mui/material";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import moment from "moment";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";
import {
  selectCurrentActiveCard,
  updateCurrentActiveCard,
} from "~/redux/activeCard/activeCardSlice";
import { updateCardDetailsAPI } from "~/apis";
import { useDispatch } from "react-redux";
import { updateCardInBoard } from "~/redux/activeBoard/activeBoardSlice";
const label = { inputProps: { "aria-label": "Checkbox demo" } };
export const SidebarItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  color: theme.palette.mode === "dark" ? "#90caf9" : "#172b4d",
  backgroundColor: theme.palette.mode === "dark" ? "#2f3542" : "#091e420f",
  padding: "10px",
  borderRadius: "4px",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark" ? "#33485D" : theme.palette.grey[300],
    "&.active": {
      color: theme.palette.mode === "dark" ? "#000000de" : "#0c66e4",
      backgroundColor: theme.palette.mode === "dark" ? "#90caf9" : "#e9f2ff",
    },
  },
}));
const DeadlineModal = ({ typeButton, onSaveDeadline }) => {
  const [open, setOpen] = useState(false);
  const [deadline, setDeadline] = useState(null);
  const [reminderTime, setReminderTime] = useState(null);
  const [reminderOption, setReminderOption] = useState("select");
  const [isChecked, setIsChecked] = useState(false);
  const [chipStatus, setChipStatus] = useState({ color: "default", text: "" });
  const activeCard = useSelector(selectCurrentActiveCard);
  const dispatch = useDispatch();

  // Cập nhật trạng thái `Chip` dựa trên thời gian
  useEffect(() => {
    if (!activeCard?.deadline) return;
    const now = dayjs();
    // Nếu thẻ đã hoàn thành thì hiển thị chip Complete
    if (activeCard.isComplete) {
      setChipStatus({ color: "success", text: "Complete" });
      setIsChecked(true);
    } else if (activeCard.isComplete === false) {
      setIsChecked(false);
      // Nếu thẻ chưa hoàn thành thì kiểm tra thời gian để hiển thị chip
      if (now.isAfter(activeCard?.deadline)) {
        setChipStatus({ color: "error", text: "Overdue" });
      } else if (
        now.isAfter(activeCard?.reminderTime) &&
        now.isBefore(activeCard?.deadline)
      ) {
        setChipStatus({ color: "warning", text: "Due Soon" });
      } else {
        setChipStatus({ color: "default", text: "" });
      }
    }
  }, [activeCard, deadline, reminderTime, dispatch]);
  const handleCheckboxChange = async (event) => {
    setIsChecked(event.target.checked);
    if (event.target.checked) {
      const updateData = await updateCardDetailsAPI(activeCard._id, {
        isComplete: true,
      });
      if (updateData) {
        dispatch(updateCurrentActiveCard(updateData));
        dispatch(updateCardInBoard(updateData));
      }
    } else if (event.target.checked === false) {
      const updateData = await updateCardDetailsAPI(activeCard._id, {
        isComplete: false,
      });
      if (updateData) {
        dispatch(updateCurrentActiveCard(updateData));
        dispatch(updateCardInBoard(updateData));
      }
    }
  };
  // Các tùy chọn reminder
  const reminderOptions = [
    { label: "--Select reminder--", value: "select" },
    { label: "No Reminder", value: "1s" },
    { label: "1 Hour Before", value: "1h" },
    { label: "12 Hours Before", value: "12h" },
    { label: "1 Day Before", value: "1d" },
    { label: "2 Days Before", value: "2d" },
  ];
  // Cập nhật reminder dựa trên tùy chọn
  const handleReminderChange = (event) => {
    const reminderOption = event.target.value;
    console.log("Reminder Option: ", reminderOption);
    setReminderOption(reminderOption);
    let newReminderTime = null;
    switch (reminderOption) {
      case "1h":
        newReminderTime = deadline.subtract(1, "hour");
        break;
      case "12h":
        newReminderTime = deadline.subtract(12, "hour");
        break;
      case "1d":
        newReminderTime = deadline.subtract(1, "day");
        break;
      case "2d":
        newReminderTime = deadline.subtract(2, "day");
        break;
      case "1s":
        newReminderTime = deadline.subtract(1, "second");
        break;
      default:
        newReminderTime = null;
        break;
    }
    setReminderTime(newReminderTime);
    console.log("Reminder Time: ", newReminderTime);
  };
  // Xử lý khi chọn ngày mới
  const handleDateChange = (newValue) => {
    if (!newValue) return;
    setDeadline(newValue);
    console.log("Deadline: ", newValue);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    console.log("Deadline: ", deadline);
    console.log("Reminder Time: ", reminderTime);
    if (reminderTime === "select") {
      toast.error("Please select a reminder time");
    }
    if (!deadline) {
      setDeadline(dayjs()); //set deadline mac dinh la ngay hien tai
    }
    //kiem tra xem deadline va reminder co phai la ngay trong tuong lai hay khong ? neu khong thi bao loi va khong cho luu
    if (deadline.isBefore(dayjs())) {
      toast.error("Deadline must be in the future");
      return;
    } else if (reminderTime.isBefore(dayjs()) && reminderTime !== "select") {
      toast.error("Reminder must be in the future");
      return;
    }
    onSaveDeadline(deadline, reminderTime);
    //truoc khi dong modal thi can reset lai cac gia tri
    setDeadline(null);
    setReminderOption("select");
    setReminderTime(null);
    setOpen(false);
  };
  return (
    <Box>
      {typeButton === "Add" && (
        <SidebarItem onClick={handleOpen}>
          <WatchLaterOutlinedIcon />
          Dates
        </SidebarItem>
      )}
      {typeButton === "Show" && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}>
          {/* click vào checkbox thì chip sẽ hiện ra */}
          <Checkbox
            {...label}
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <SidebarItem onClick={handleOpen} sx={{ my: 1 }}>
            <WatchLaterOutlinedIcon />
            {dayjs(activeCard.deadline).format("DD/MM/YYYY HH:mm")}
            {chipStatus.text && (
              <Chip label={chipStatus.text} color={chipStatus.color} />
            )}
            <ExpandMoreIcon
              sx={{
                mr: 1,
              }}
            />
          </SidebarItem>
        </Box>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Box
          sx={{
            width: 420,
            height: "90%",
            overflowY: "auto",
            overflowX: "hidden",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}>
          <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
            Dates
          </Typography>
          <Divider
            sx={{
              borderWidth: "3px",
            }}
          />
          {/* DateTimePickers */}
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={["DateTimePicker", "StaticDateTimePicker"]}>
                <DemoItem>
                  <StaticDateTimePicker
                    value={deadline}
                    defaultValue={dayjs(
                      moment(new Date()).format("YYYY-MM-DDTHH:mm:ss")
                    )}
                    slotProps={{
                      actionBar: {
                        actions: [],
                      },
                    }}
                    onChange={handleDateChange}
                  />
                </DemoItem>
                <DemoItem>
                  <TextField
                    id="due-date"
                    label="Due Date"
                    variant="outlined"
                    defaultValue={moment(new Date()).format("YYYY-MM-DD HH:mm")}
                    value={deadline?.format("YYYY-MM-DD HH:mm")}
                  />
                </DemoItem>
                <DemoItem>
                  {/* Select cho Reminder */}
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="reminder-select-label">Reminder</InputLabel>
                    <Select
                      labelId="reminder-select-label"
                      value={reminderOption}
                      label="Reminder"
                      onChange={handleReminderChange}>
                      {reminderOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          </Box>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            sx={{ mt: 3 }}>
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default DeadlineModal;
