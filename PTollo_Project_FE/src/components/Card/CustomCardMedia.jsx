import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CardActionArea from "@mui/material/CardActionArea";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { cloneTemplateAPI, deleteTemplateAPI, fetchTemplatesAPI } from "~/apis";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const CustomCardMedia = ({
  template,
  onShareTemplate,
  handleDeleteTemplate,
}) => {
  const navigate = useNavigate();
  // Xử lý áp dụng một template để tạo board mới
  const handleApplyTemplate = async (templateId) => {
    try {
      const boardId = await cloneTemplateAPI(templateId);
      toast.success(`Board đã được tạo với ID: ${boardId}`);
      navigate(`/boards/${boardId}`);
    } catch (error) {
      toast.error("Không thể áp dụng template:", error);
    }
  };
  return (
    <Card
      sx={{
        minWidth: 200,
        position: "relative",
      }}>
      <CardActionArea onClick={() => navigate(`/templates/${template._id}`)}>
        <CardMedia
          sx={{ height: 132, backgroundColor: template?.background }}
          image={template?.background}
          title={template?.title}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            position: "relative",
            ml: 2,
            top: -26,
            zIndex: 1,
          }}>
          <Tooltip title={template?.displayName || "Template Creator"}>
            <Avatar
              alt={template?.displayName || "Template Creator"}
              src={template?.avatar}
              sx={{
                width: 53,
                height: 53,
                border: "3px solid white",
              }}
            />
          </Tooltip>
        </Box>
        <CardContent sx={{ pt: 0.1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {template?.title}
          </Typography>
          <Box
            sx={{
              width: "100%",
            }}>
            <Tooltip
              title={template?.description || "No description available"}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  whiteSpace: "nowrap", // Prevents wrapping
                  overflow: "hidden", // Hides overflow
                  textOverflow: "ellipsis", // Adds ellipsis when text is too long
                }}>
                {template?.description || "No description available"}
              </Typography>
            </Tooltip>
          </Box>
        </CardContent>
      </CardActionArea>
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleApplyTemplate(template._id)}>
          Use Template
        </Button>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => {
              onShareTemplate(template);
              navigator.clipboard.writeText(
                `${window.location.origin}/templates/${template._id}`
              );
              toast.info("Template link copied to clipboard!");
            }}>
            Share
          </Button>
          <IconButton
            aria-label="delete"
            size="small"
            color="error"
            onClick={() => handleDeleteTemplate(template._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default CustomCardMedia;
