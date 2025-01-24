import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { Button, Typography, Box } from "@mui/material";
import { selectCurrentActiveBoard } from "~/redux/activeBoard/activeBoardSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "~/redux/user/userSlice";
import { ZIM } from "zego-zim-web";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  selectCurrentCallInfo,
  setCallInfo,
} from "~/redux/activieCall/callSlice";
import { joinRoomCallAPI } from "~/apis";
function getUrlParams(url) {
  ///call/kbA9dlsG1jaGYPh
  let urlStr = url.split("/")[2];
  return urlStr;
}
function CallPage() {
  const url = useLocation().pathname; // Lấy URL hiện tại
  const roomIdFromUrl = getUrlParams(url);
  const callInfo = useSelector(selectCurrentCallInfo); // Lấy callInfo từ Reduxhoặc từ Redux
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const zpRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [joined, setJoined] = useState(false);

  const currentBoard = useSelector(selectCurrentActiveBoard);
  const currentUser = useSelector(selectCurrentUser);
  // Generate members call
  const members = [
    ...(currentBoard?.owners || []),
    ...(currentBoard?.members || []),
  ]
    .filter((member) => member._id !== currentUser._id)
    .map((member) => ({
      userID: member._id,
      userName: member.displayName,
    }));

  useEffect(() => {
    if (callInfo.roomId && callInfo.token) {
      // Tham gia phòng với thông tin đã lưu trong Redux
      myMeeting(callInfo.roomId, callInfo.token);
    }
    return () => {
      if (zpRef.current) {
        zpRef.current.destroy(); // Cleanup on unmount
      }
    };
  }, [callInfo, dispatch, currentUser._id]);

  if (roomIdFromUrl && !callInfo.roomId && !callInfo.token) {
    // Nếu có roomId từ URL thì tham gia phòng với roomId đó
    // Nếu không có token thì gọi API để lấy token
    const callID = currentUser._id; // Đảm bảo đây là duy nhất
    joinRoomCallAPI({ roomId: roomIdFromUrl, userId: callID }).then((res) => {
      dispatch(setCallInfo(res));
      myMeeting(roomIdFromUrl, res.token);
    });
  }

  // Generate the token and join the room
  const myMeeting = (roomId, token) => {
    const appID = 589406393; // Your AppID
    if (!token || !roomId) {
      console.error("Error: Missing tokens or roomId");
      return;
    }

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      appID,
      token,
      roomId,
      currentUser._id,
      currentUser.name
    );
    // console.log("roomId", roomId);
    // console.log("kitToken", kitToken);

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    const callID = currentUser._id; // Đảm bảo đây là duy nhất
    zp.addPlugins({ ZIM });
    zpRef.current = zp;
    // Set call invitation configuration
    zp.setCallInvitationConfig({
      canInvitingInCalling: true,
      onlyInitiatorCanInvite: false,
      onSetRoomConfigBeforeJoining: () => {
        return {
          showWaitingCallAcceptAudioVideoView: true,
          callingInvitationListConfig: {
            waitingSelectUsers: members,
            defaultChecked: true,
          },
        };
      },
    });
    // Update call invitation list after joining the room
    zp.updateCallingInvitationListConfig({
      waitingSelectUsers: members,
      defaultChecked: true,
    });

    zp.joinRoom({
      container: videoContainerRef.current,
      sharedLinks: [
        {
          name: "Video Call Link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      maxUsers: 20,
      onJoinRoom: () => {
        setJoined(true); // Mark as joined
        console.log("Đã tham gia phòng thành công");
      },
      onLeaveRoom: () => {
        setJoined(false); // Mark as left
        navigate(`/boards`); // Navigate back to board on leave
      },
      onError: (error) => {
        console.error("Lỗi tham gia phòng:", error); // Log lỗi nếu có
        toast.error("Không thể tham gia phòng.");
      },
    });

    zp.sendCallInvitation({
      callees: members,
      callType: ZegoUIKitPrebuilt.InvitationTypeVideoCall,
      notificationConfig: {
        title: "Call invitation",
        message: "Incoming video call...",
      },
      callID: callID,
    });
  };

  // Handle exit from the room
  const handleExit = () => {
    if (zpRef.current) {
      zpRef.current.destroy(); // Clean up the Zego instance
    }
    navigate(`/boards/${currentBoard._id}`); // Navigate to board page
  };

  // On component mount, extract call type from location and initialize the meeting

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 1,
      }}>
      {/* Display header and exit button if not yet joined */}

      {!joined && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#282c34",
            color: "white",
          }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}>
            <Typography
              sx={{
                backgroundColor: "#282c34",
                textAlign: "center",
                color: "white",
                padding: "1rem",
                fontSize: "1.5rem",
              }}
              variant="h3"
              gutterBottom>
              Group Video Call
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="error"
            onClick={handleExit}
            sx={{
              mx: 1,
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
            }}>
            Exit
          </Button>
        </Box>
      )}

      {/* Video container */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 80px)",
        }}
        ref={videoContainerRef}
      />
    </Box>
  );
}

export default CallPage;
