import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CancelIcon from "@mui/icons-material/Cancel";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import AspectRatioOutlinedIcon from "@mui/icons-material/AspectRatioOutlined";
import AddToDriveOutlinedIcon from "@mui/icons-material/AddToDriveOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import SubjectRoundedIcon from "@mui/icons-material/SubjectRounded";
import DvrOutlinedIcon from "@mui/icons-material/DvrOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import moment from "moment";

import ToggleFocusInput from "~/components/Form/ToggleFocusInput";
import VisuallyHiddenInput from "~/components/Form/VisuallyHiddenInput";
import {
  multipleFilesValidator,
  singleFileValidator,
} from "~/utils/validators";
import { toast } from "react-toastify";
import CardUserGroup from "./CardUserGroup";
import CardDescriptionMdEditor from "./CardDescriptionMdEditor";
import CardActivitySection from "./CardActivitySection";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAndHideCurrentActiveCard,
  selectCurrentActiveCard,
  updateCurrentActiveCard,
  selectIsShowModalActiveCard,
} from "~/redux/activeCard/activeCardSlice";
import {
  deleteAttachmentAPI,
  renameAttachmentAPI,
  saveDeadlineAPI,
  updateCardDetailsAPI,
  uploadAttachmentAPI,
} from "~/apis";
import { updateCardInBoard } from "~/redux/activeBoard/activeBoardSlice";
import { selectCurrentUser } from "~/redux/user/userSlice";
import { CARD_MEMBER_ACTIONS } from "~/utils/constants";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { styled } from "@mui/material/styles";
import AttachmentPopover from "~/components/Popover/AttachmentPopover";
import { Button } from "@mui/material";
import DeadlineModal from "./DeadlineModal";
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

/**
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover. Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì, nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */
function ActiveCard() {
  const dispatch = useDispatch();
  const activeCard = useSelector(selectCurrentActiveCard);
  const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard);
  const currentUser = useSelector(selectCurrentUser);
  const [userAddFile, setUserAddFile] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentFile, setCurrentFile] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event, file) => {
    setAnchorEl(event.currentTarget);
    setCurrentFile(file);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setCurrentFile(null); // Xóa thông tin file khi menu đóng
  };

  // Không dùng biến State để check đóng mở Modal nữa vì chúng ta sẽ check theo cái biến isShowModalActiveCard trong redux
  // const [isOpen, setIsOpen] = useState(true);
  // const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    // setIsOpen(false)
    dispatch(clearAndHideCurrentActiveCard());
  };

  // Func gọi API dùng chung cho các trường hợp update card title, description, cover, comment...vv
  const callApiUpdateCard = async (updateData, type = "update") => {
    console.log(updateData);
    if (type === "update") {
      console.log(updateData);
      const updatedCard = await updateCardDetailsAPI(
        activeCard._id,
        updateData
      );
      // B1: Cập nhật lại cái card đang active trong modal hiện tại
      dispatch(updateCurrentActiveCard(updatedCard));
      // B2: Cập nhật lại cái bản ghi card trong cái activeBoard (nested data)
      dispatch(updateCardInBoard(updatedCard));
      return updatedCard;
    } else {
      const { updatedCard, userInfo } = await uploadAttachmentAPI(
        activeCard._id,
        updateData
      );
      setUserAddFile(userInfo);
      // B1: Cập nhật lại cái card đang active trong modal hiện tại
      dispatch(updateCurrentActiveCard(updatedCard));
      // B2: Cập nhật lại cái bản ghi card trong cái activeBoard (nested data)
      dispatch(updateCardInBoard(updatedCard));
      return updatedCard;
    }
  };

  const onUpdateCardTitle = (newTitle) => {
    callApiUpdateCard({ title: newTitle.trim() }, "update");
  };

  const onUpdateCardDescription = (newDescription) => {
    callApiUpdateCard({ description: newDescription }, "update");
  };

  const onUploadCardCover = (event) => {
    // console.log(event.target?.files[0])
    const error = singleFileValidator(event.target?.files[0]);
    if (error) {
      toast.error(error);
      return;
    }
    let reqData = new FormData();
    reqData.append("cardCover", event.target?.files[0]);

    // Gọi API...
    toast.promise(
      callApiUpdateCard(reqData, "update").finally(
        () => (event.target.value = "")
      ),
      { pending: "Updating..." }
    );
  };
  const handleAttachFile = async (files) => {
    const error = multipleFilesValidator(files);
    if (error) {
      toast.error(error);
      return;
    }
    let reqData = new FormData();
    [...files].forEach((file) => {
      reqData.append("attachments", file);
    });
    // Gọi API...
    toast.promise(callApiUpdateCard(reqData, "attachment"), {
      pending: "Uploading...",
    });
    //log activity
    const commentToAdd = {
      userAvatar: currentUser?.avatar,
      userDisplayName: currentUser?.displayName,
      content: `${currentUser.displayName} đã thêm file vào thẻ.`,
    };
    onAddCardComment(commentToAdd);
  };

  // Dùng async await ở đây để component con CardActivitySection chờ và nếu thành công thì mới clear thẻ input comment
  const onAddCardComment = async (commentToAdd) => {
    await callApiUpdateCard({ commentToAdd });
  };

  const onUpdateCardMembers = (incomingMemberInfo) => {
    callApiUpdateCard({ incomingMemberInfo });
  };
  const handleDownload = (url, fileName, typeFile) => {
    // console.log(url, fileName, typeFile);
    const getFileNameWithExtension = (name, type) => {
      if (!name.includes(".")) {
        const extension = type.split("/")[1];
        return `${name}.${extension}`;
      }
      return name;
    };

    const finalFileName = getFileNameWithExtension(fileName, typeFile);
    console.log(finalFileName);
    const downloadUrl = `${url}`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = finalFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleSaveDeadline = async (deadline, reminderTime) => {
    const saveDeadline = await saveDeadlineAPI(activeCard._id, {
      deadline,
      reminderTime,
      isComplete: false,
    });
    if (saveDeadline) {
      // B1: Cập nhật lại cái card đang active trong modal hiện tại
      dispatch(updateCurrentActiveCard(saveDeadline));
      // B2: Cập nhật lại cái bản ghi card trong cái activeBoard (nested data)
      dispatch(updateCardInBoard(saveDeadline));

      //log activity
      const commentToAdd = {
        userAvatar: currentUser?.avatar,
        userDisplayName: currentUser?.displayName,
        content: `${currentUser.displayName} đã thêm deadline cho thẻ vào lúc ${moment(saveDeadline.deadline).format("lll")}.`,
      };
      onAddCardComment(commentToAdd);
    }
  };

  const handleDeleteFile = async (publicId, fileName) => {
    try {
      // Gọi API để xóa file
      const updatedCard = await deleteAttachmentAPI(activeCard._id, publicId);

      // Cập nhật Redux store
      dispatch(updateCurrentActiveCard(updatedCard));
      dispatch(updateCardInBoard(updatedCard));
      toast.success("File deleted successfully!");

      //log activity
      const commentToAdd = {
        userAvatar: currentUser?.avatar,
        userDisplayName: currentUser?.displayName,
        content: `${currentUser.displayName} đã xóa file ${fileName} khỏi thẻ.`,
      };
      onAddCardComment(commentToAdd);
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file.");
    }
  };

  const handleEditFileName = async (publicId, currentFileName) => {
    // Hiển thị prompt để người dùng nhập tên file mới
    const newFileName = prompt("Enter new file name:", currentFileName);
    if (!newFileName || newFileName === currentFileName) return;

    try {
      // Gọi API để đổi tên file
      const updatedCard = await renameAttachmentAPI(
        activeCard._id,
        publicId,
        newFileName
      );

      // Cập nhật Redux store
      dispatch(updateCurrentActiveCard(updatedCard));
      dispatch(updateCardInBoard(updatedCard));
      toast.success("File name updated successfully!");
    } catch (error) {
      console.error("Error updating file name:", error);
      toast.error("Failed to update file name.");
    }
  };

  return (
    <Modal
      disableScrollLock
      open={isShowModalActiveCard}
      onClose={handleCloseModal} // Sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
      sx={{ overflowY: "auto" }}>
      <Box
        sx={{
          position: "relative",
          width: 750,
          maxWidth: 750,
          bgcolor: "white",
          boxShadow: 24,
          borderRadius: "10px",
          border: "none",
          outline: 0,
          padding: "40px 20px 20px",
          margin: "50px auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        }}>
        <Box
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            cursor: "pointer",
          }}>
          <CancelIcon
            color="error"
            sx={{ "&:hover": { color: "error.light" } }}
            onClick={handleCloseModal}
          />
        </Box>

        {activeCard?.cover && (
          <Box sx={{ mb: 4 }}>
            <img
              style={{
                width: "100%",
                height: "300px",
                borderRadius: "10px",
                objectFit: "cover",
              }}
              src={activeCard?.cover}
              alt="card-cover"
            />
          </Box>
        )}

        <Box
          sx={{
            mb: 1,
            mt: -3,
            pr: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}>
          <CreditCardIcon />

          {/* Feature 01: Xử lý tiêu đề của Card */}
          <ToggleFocusInput
            inputFontSize="22px"
            value={activeCard?.title}
            onChangedValue={onUpdateCardTitle}
          />
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Left side */}
          <Grid size={{ xs: 12, sm: 9 }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{ fontWeight: "600", color: "primary.main", mb: 1 }}>
                Members
              </Typography>

              {/* Feature 02: Xử lý các thành viên của Card */}
              <CardUserGroup
                cardMemberIds={activeCard?.memberIds}
                onUpdateCardMembers={onUpdateCardMembers}
              />
            </Box>
            {activeCard?.deadline && (
              <DeadlineModal
                typeButton={"Show"}
                onSaveDeadline={handleSaveDeadline}
              />
            )}

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography
                  variant="span"
                  sx={{ fontWeight: "600", fontSize: "20px" }}>
                  Description
                </Typography>
              </Box>

              {/* Feature 03: Xử lý mô tả của Card */}
              <CardDescriptionMdEditor
                cardDescriptionProp={activeCard?.description}
                handleUpdateCardDescription={onUpdateCardDescription}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  justifyContent: "space-between",
                }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <AttachmentIcon />
                  <Typography
                    variant="span"
                    sx={{ fontWeight: "600", fontSize: "20px" }}>
                    Attachment
                  </Typography>
                </Box>
                <AttachmentPopover
                  onAttachFile={handleAttachFile}
                  typeButton={"Add"}
                />
              </Box>
              {activeCard?.attachments && (
                <Box sx={{ m: 2, ml: 5 }}>
                  <Typography
                    variant="span"
                    sx={{ fontWeight: "600", fontSize: "14px", my: 2 }}>
                    Files
                  </Typography>
                  <Stack direction="column" spacing={1}>
                    {/* Xử lý gửi attachment */}
                    {activeCard?.attachments?.map((attachment, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          justifyContent: "space-between",
                        }}>
                        <Box>
                          <Button
                            onClick={() =>
                              handleDownload(
                                attachment.url,
                                attachment.fileName,
                                attachment.typeFile
                              )
                            }
                            sx={{
                              textTransform: "none",
                              fontSize: "14px",
                              fontWeight: "600",
                              display: "flex",
                              justifyContent: "space-around",
                              alignItems: "center",
                              width: "100%",
                              height: "80px",
                            }}>
                            <Box
                              sx={{
                                width: "72px",
                                height: "56px",
                                px: 3,
                                py: 2,
                                mr: 2,
                                borderRadius: "5px",
                                backgroundColor: (theme) =>
                                  theme.palette.mode === "dark"
                                    ? "#2f3542"
                                    : "#f0f0f0",
                              }}>
                              {attachment?.typeFile.split("/")[1] === "svg+xml"
                                ? "svg"
                                : attachment?.typeFile.split("/")[1] ===
                                    "vnd.ms-excel"
                                  ? "xls"
                                  : attachment?.typeFile.split("/")[1] ===
                                      "vnd.ms-powerpoint"
                                    ? "ppt"
                                    : attachment?.typeFile.split("/")[1] ===
                                        "msword"
                                      ? "doc"
                                      : attachment?.typeFile.split("/")[1] ===
                                          "plain"
                                        ? "txt"
                                        : attachment?.typeFile.split("/")[1] ===
                                            "vnd.openxmlformats-officedocument.wordprocessingml.document"
                                          ? "docx"
                                          : attachment?.typeFile.split(
                                                "/"
                                              )[1] ===
                                              "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                            ? "xlsx"
                                            : attachment?.typeFile.split(
                                                  "/"
                                                )[1] ===
                                                "vnd.openxmlformats-officedocument.presentationml.presentation"
                                              ? "pptx"
                                              : attachment?.typeFile.split(
                                                    "/"
                                                  )[1] === "x-zip-compressed"
                                                ? "zip"
                                                : attachment?.typeFile.split(
                                                    "/"
                                                  )[1]}
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                                width: "300px",
                                height: "68px",
                              }}>
                              <Typography
                                sx={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  alignSelf: "flex-start",
                                }}>
                                {attachment.fileName}
                              </Typography>
                              <Typography
                                variant="span"
                                sx={{
                                  fontSize: "12px",
                                  mt: 1,
                                  fontWeight: "300",
                                }}>
                                Add by{" "}
                                <strong>{userAddFile?.displayName}</strong>
                                <br />
                                {moment(attachment.uploadedAt).format(
                                  "lll"
                                )}{" "}
                                ago
                              </Typography>
                            </Box>
                          </Button>
                        </Box>
                        <Box>
                          <Button
                            id="basic-button"
                            aria-controls={open ? "basic-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={(event) => handleClick(event, attachment)}
                            variant="contained"
                            sx={{
                              minWidth: "0px",
                              width: "64px",
                              height: "36px",
                              backgroundColor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? "#2f3542"
                                  : "#f0f0f0",
                              color: (theme) => theme.palette.text.primary,
                            }}>
                            ...
                          </Button>
                          <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            MenuListProps={{
                              "aria-labelledby": "basic-button",
                            }}>
                            <MenuItem
                              onClick={() => {
                                handleEditFileName(
                                  currentFile.publicId,
                                  currentFile.fileName
                                );
                                handleClose();
                              }}>
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                handleDeleteFile(
                                  currentFile.publicId,
                                  currentFile.fileName
                                );
                                handleClose();
                              }}>
                              Delete
                            </MenuItem>
                          </Menu>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography
                  variant="span"
                  sx={{ fontWeight: "600", fontSize: "20px" }}>
                  Activity
                </Typography>
              </Box>

              {/* Feature 04: Xử lý các hành động, ví dụ comment vào Card */}
              <CardActivitySection
                cardComments={activeCard?.comments}
                onAddCardComment={onAddCardComment}
              />
            </Box>
          </Grid>

          {/* Right side */}
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography
              sx={{ fontWeight: "600", color: "primary.main", mb: 1 }}>
              Add To Card
            </Typography>
            <Stack direction="column" spacing={1}>
              {/* Feature 05: Xử lý hành động bản thân user tự join vào card */}
              {/* Nếu user hiện tại đang đăng nhập chưa thuộc mảng memberIds của card thì mới cho hiện nút Join và ngược lại */}
              {activeCard?.memberIds?.includes(currentUser._id) ? (
                <SidebarItem
                  sx={{
                    color: "error.light",
                    "&:hover": { color: "error.light" },
                  }}
                  onClick={() =>
                    onUpdateCardMembers({
                      userId: currentUser._id,
                      action: CARD_MEMBER_ACTIONS.REMOVE,
                    })
                  }>
                  <ExitToAppIcon fontSize="small" />
                  Leave
                </SidebarItem>
              ) : (
                <SidebarItem
                  className="active"
                  onClick={() =>
                    onUpdateCardMembers({
                      userId: currentUser._id,
                      action: CARD_MEMBER_ACTIONS.ADD,
                    })
                  }>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}>
                      <PersonOutlineOutlinedIcon fontSize="small" />
                      <span>Join</span>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CheckCircleIcon
                        fontSize="small"
                        sx={{ color: "#27ae60" }}
                      />
                    </Box>
                  </Box>
                </SidebarItem>
              )}

              {/* Feature 06: Xử lý hành động cập nhật ảnh Cover của Card */}
              <SidebarItem className="active" component="label">
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <ImageOutlinedIcon fontSize="small" />
                    <span>Cover</span>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CheckCircleIcon
                      fontSize="small"
                      sx={{ color: "#27ae60" }}
                    />
                  </Box>
                </Box>
                <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
              </SidebarItem>
              {/* Attachment with Popover */}
              <AttachmentPopover
                onAttachFile={handleAttachFile}
                typeButton={"Attachment"}
              />
              <SidebarItem>
                <LocalOfferOutlinedIcon fontSize="small" />
                Labels
              </SidebarItem>
              <SidebarItem>
                <TaskAltOutlinedIcon fontSize="small" />
                Checklist
              </SidebarItem>
              {/* Dates */}
              <DeadlineModal
                typeButton={"Add"}
                onSaveDeadline={handleSaveDeadline}
              />
              <SidebarItem>
                <AutoFixHighOutlinedIcon fontSize="small" />
                Custom Fields
              </SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography
              sx={{ fontWeight: "600", color: "primary.main", mb: 1 }}>
              Power-Ups
            </Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem>
                <AspectRatioOutlinedIcon fontSize="small" />
                Card Size
              </SidebarItem>
              <SidebarItem>
                <AddToDriveOutlinedIcon fontSize="small" />
                Google Drive
              </SidebarItem>
              <SidebarItem>
                <AddOutlinedIcon fontSize="small" />
                Add Power-Ups
              </SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography
              sx={{ fontWeight: "600", color: "primary.main", mb: 1 }}>
              Actions
            </Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem>
                <ArrowForwardOutlinedIcon fontSize="small" />
                Move
              </SidebarItem>
              <SidebarItem>
                <ContentCopyOutlinedIcon fontSize="small" />
                Copy
              </SidebarItem>
              <SidebarItem>
                <AutoAwesomeOutlinedIcon fontSize="small" />
                Make Template
              </SidebarItem>
              <SidebarItem>
                <ArchiveOutlinedIcon fontSize="small" />
                Archive
              </SidebarItem>
              <SidebarItem>
                <ShareOutlinedIcon fontSize="small" />
                Share
              </SidebarItem>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default ActiveCard;
