import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import theme from "~/theme";
import CardTitle from "~/components/Card/CardTitle";
import { selectStarredBoards } from "~/redux/user/userSlice";
import { useSelector } from "react-redux";
const Starred = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const starredBoards = useSelector(selectStarredBoards);
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className="ButonMenu">
        Starred <KeyboardArrowDownRoundedIcon sx={{ fontSize: "xx-large" }} />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        style={{ marginTop: theme.Ptollo.marTopMenu }}
        onClose={handleClose}
        sx={{
          "& .MuiList-root": {
            width: "300px",
            padding: "12px",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            borderRadius: "15px",
          },
          maxHeight: "450px",
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        {starredBoards?.map((board) => (
          <MenuItem onClick={handleClose} key={board.boardId}>
            <CardTitle
              title={board.title}
              description={board.description}
              boardId={board.boardId}
              background={board.background}
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default Starred;
