import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import theme from "~/theme";

const Workspace = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
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
        onClick={handleClick}>
        Workspace <KeyboardArrowDownRoundedIcon sx={{ fontSize: "xx-large" }} />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        style={{ marginTop: theme.Ptollo.marTopMenu }}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          sx: { maxHeight: "183px" },
        }}>
        <Box
          sx={{
            fontSize: "14px",
            margin: "10px 20px 0px 20px",
            color: "text.secondary",
            fontWeight: "600",
          }}>
          Your Workspaces
        </Box>
        <MenuItem onClick={handleClose}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              margin: "0px 8px 2px",
            }}>
            <Avatar
              sx={{ background: theme.Ptollo.avatarColor }}
              variant="rounded"></Avatar>
            <Box sx={{ ml: 1, fontSize: "14px", fontWeight: "500" }}>
              NamNguyen7040s Workspace 1
            </Box>
          </Box>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Workspace;
