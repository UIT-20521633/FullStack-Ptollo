import { useState } from "react";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import VisuallyHiddenInput from "~/components/Form/VisuallyHiddenInput";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { Divider } from "@mui/material";
import { FileUploader } from "react-drag-drop-files";
const SidebarItem = styled(Box)(({ theme }) => ({
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

function AttachmentPopover({ onAttachFile, typeButton }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "attachment-popover" : undefined;

  const handleFileUpload = (event) => {
    const file = event.target.files;
    if (file) {
      onAttachFile(file);
      handleClose(); // Close popover after file selection
    }
  };

  return (
    <>
      {typeButton === "Attachment" ? (
        <SidebarItem onClick={handleClick}>
          <AttachFileOutlinedIcon fontSize="small" />
          Attachment
        </SidebarItem>
      ) : (
        <Button onClick={handleClick} variant="contained" color="primary">
          Add
        </Button>
      )}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}>
        <Box sx={{ padding: 2, maxWidth: 400 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Typography sx={{ mb: 2, fontWeight: "bold" }}>
              Attach a file
            </Typography>
          </Box>
          <Divider sx={{ width: "100%" }} />
          <FileUploader
            multiple={true}
            handleChange={(files) => {
              if (files.length > 0) {
                onAttachFile(files);
                handleClose();
              }
            }}
            name="file"
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mb: 1 }}>
            Upload File
            <VisuallyHiddenInput
              type="file"
              multiple
              onChange={handleFileUpload}
            />
          </Button>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Choose a file to attach to the card.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
            Max file size is 100MB.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
            <Button
              sx={{
                mt: 2,
                mr: 1,
                color: "error.main",
                borderColor: "error.main",
              }}
              onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}

export default AttachmentPopover;
