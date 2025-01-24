import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import EditIcon from "@mui/icons-material/Edit";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import MessageModal from "../Modal/Message/MessageModal";
import CompleteModal from "../Modal/CompleteModal/CompleteModal";
import { useSelector } from "react-redux";
import { selectSelectedUser } from "~/redux/Chats/chatSlice";
import {
  fetchCompletionBoardAPI,
  selectCompletionBoard,
} from "~/redux/activeBoard/activeBoardSlice";
import { useDispatch } from "react-redux";

const FABMessage = ({ board }) => {
  const [activeModal, setActiveModal] = React.useState(null); // 'chat' | 'completed' | null
  const selectUser = useSelector(selectSelectedUser); // Lấy thông tin user đang được chọn
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCompletionBoardAPI(board._id));
  }, [dispatch, board._id]);

  const completeData = useSelector(selectCompletionBoard); // Lấy thông tin board đang được chọn

  const openModal = (type) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);
  const handleOpenChat = () => {
    setActiveModal("chat");
  };
  return (
    <Box>
      {/* SpeedDial for actions */}
      <Box sx={{ height: 320, transform: "translateZ(0px)", flexGrow: 1 }}>
        <SpeedDial
          ariaLabel="SpeedDial for FAB actions"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          icon={<SpeedDialIcon openIcon={<EditIcon />} />}>
          {/* Open Chat Action */}
          <SpeedDialAction
            key="Open Chat"
            icon={<MessageRoundedIcon sx={{ fontSize: 30 }} />}
            tooltipTitle="Open Chat"
            onClick={handleOpenChat}
            sx={{
              width: 55,
              height: 55,
              backgroundColor: (theme) => theme.palette.chatButton,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.chatButtonHover,
              },
            }}
          />
          {/* Completed Action */}
          <SpeedDialAction
            key="Completed"
            icon={<DataUsageIcon sx={{ fontSize: 30 }} />}
            tooltipTitle="Completed"
            onClick={() => openModal("completed")}
            sx={{
              width: 55,
              height: 55,
              backgroundColor: (theme) => theme.palette.chatButton,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.chatButtonHover,
              },
            }}
          />
        </SpeedDial>
      </Box>

      {/* Modals */}
      {activeModal === "chat" && (
        <MessageModal selectUser={selectUser} open={true} close={closeModal} />
      )}
      {activeModal === "completed" && (
        <CompleteModal
          open={true}
          onClose={closeModal}
          completionData={completeData}
        />
      )}
    </Box>
  );
};

export default FABMessage;
