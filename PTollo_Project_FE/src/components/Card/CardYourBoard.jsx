import React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

const CardYourBoard = ({ title }) => {
  const [star, setStar] = React.useState(false);
  const handelStarStatus = () => {
    setStar(!star);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // thêm dòng này để đẩy button về bên phải
        width: "100%", // đảm bảo Box chiếm hết chiều rộng của cha
      }}>
      <Box sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
        <Avatar
          src="https://picsum.photos/200/300?random=2"
          variant="rounded"
          sx={{
            height: "30px",
            width: "30px",
          }}
        />
        <Box
          sx={{
            ml: 1,
            maxWidth: "100%", // giới hạn chiều rộng của văn bản
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
          {title}
        </Box>
      </Box>
      <Button onClick={handelStarStatus} sx={{ p: 0, m: 0, minWidth: 0 }}>
        {star ? (
          <StarRoundedIcon sx={{ color: "#e8e809" }} />
        ) : (
          <StarBorderRoundedIcon sx={{ color: "#e8e809" }} />
        )}
      </Button>
    </Box>
  );
};

export default CardYourBoard;
