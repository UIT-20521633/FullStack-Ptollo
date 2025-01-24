import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import theme from "~/theme";
import CardSmall from "~/components/Card/CardSmall";
import { useSelector } from "react-redux";
import { selectRecentlyViewedBoards } from "~/redux/user/userSlice";
const Recent = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const recentlyViewedBoards = useSelector(selectRecentlyViewedBoards);
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className="ButonMenu">
        Recent <KeyboardArrowDownRoundedIcon sx={{ fontSize: "xx-large" }} />
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
        }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        {recentlyViewedBoards?.map((board) => (
          <MenuItem onClick={handleClose} key={board.boardId}>
            <CardSmall
              title={board.board?.title}
              description={board.board?.description}
              boardId={board.boardId}
              background={board.board?.background}
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default Recent;
