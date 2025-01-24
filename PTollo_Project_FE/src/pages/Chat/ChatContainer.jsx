import Box from "@mui/material/Box";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  getMessagesInBoard,
  selectMessages,
  selectSelectedUser,
  setMessages,
} from "~/redux/Chats/chatSlice";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../../components/Skeletons/MessageSkeleton";
import { selectCurrentUser } from "~/redux/user/userSlice";
import { initializeSocket } from "~/utils/socketManager";
import { selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const selectUser = useSelector(selectSelectedUser);
  const board = useSelector(selectCurrentActiveBoard);
  const authUser = useSelector(selectCurrentUser);
  const selectMessagesUser = useSelector(selectMessages);
  const messageEndRef = useRef(null); // Tham chiếu đến cuối của danh sách tin nhắn
  const [loading, setLoading] = useState(false);

  const subscribeToMessages = () => {
    if (!selectUser) return;
    // Subscribe to messages
    const socket = initializeSocket(authUser._id);

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectUser._id;
      if (!isMessageSentFromSelectedUser) return;

      dispatch(setMessages(newMessage));
    });
  };
  const unsubscribeFromMessages = () => {
    const socket = initializeSocket(authUser._id);
    socket.off("newMessage");
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectUser) {
        setLoading(true);
        await dispatch(
          getMessagesInBoard({ boardId: board._id, userId: selectUser._id })
        );
        setLoading(false);
        subscribeToMessages();

        return () => unsubscribeFromMessages();
      }
    };
    fetchMessages();
  }, [selectUser, dispatch]);

  useEffect(() => {
    if (messageEndRef.current && selectMessagesUser.length > 0)
      // Cuộn xuống cuối danh sách tin nhắn
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [selectMessagesUser]);

  if (loading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}>
        {/* Chat header */}
        <ChatHeader />
        {/* messages skeleton */}
        <MessageSkeleton />
        {/* Message Input */}
        <MessageInput />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        height: "100%",
      }}>
      {/* Chat header */}
      <ChatHeader />
      {/* messages */}
      <Box classname="space-y-2" sx={{ p: 2, flex: 1, overflowY: "auto" }}>
        {selectMessagesUser.map((message) => (
          <Box
            key={message._id}
            // Thêm class chat-end nếu tin nhắn được gửi bởi user hiện tại chính là current user đang đăng nhập
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}>
            <Box className=" chat-image avatar">
              {/*  Hiển thị avatar của user gửi tin nhắn */}
              <Box
                sx={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "9999px",
                  border: "1px solid",
                }}>
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.avatar || "/avatar.png"
                      : selectUser.avatar || "/avatar.png"
                  }
                  alt="profile avatar"
                />
              </Box>
            </Box>
            {/*  Hiển thị thời gian */}
            <Box className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {moment(message.createdAt).format("llll")}
              </time>
            </Box>
            {/* Hiển thị tin nhắn */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
              className="chat-bubble">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </Box>
          </Box>
        ))}
      </Box>
      {/* Message Input */}
      <MessageInput />
    </Box>
  );
};

export default ChatContainer;
