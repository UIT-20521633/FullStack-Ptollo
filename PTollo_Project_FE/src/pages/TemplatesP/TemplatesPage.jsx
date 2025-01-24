import React, { useEffect, useState } from "react";
import CustomCardMedia from "~/components/Card/CustomCardMedia";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import CollectionsSharpIcon from "@mui/icons-material/CollectionsSharp";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import EditTemplateModal from "~/components/Modal/TemplateModal/EditTemplateModal";
import { deleteTemplateAPI, fetchTemplatesAPI } from "~/apis";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchTemplatesAPI().then((data) => {
      setTemplates(data);
    });
  }, []);
  const confirmDeleteTemaplate = useConfirm();
  const handleDeleteTemplate = (templateId) => {
    confirmDeleteTemaplate({
      // Title, Description, Content...vv của gói material-ui-confirm đều có type là ReactNode nên có thể thoải sử dụng MUI components, rất tiện lợi khi cần custom styles
      title: (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            // color: "white",
          }}>
          <DeleteIcon sx={{ color: "warning.dark" }} />
          Delete Template
        </Box>
      ),
      description: "Are you sure you want to delete this template?",
      confirmationText: "Confirm",
      cancellationText: "Cancel",
    }).then(() => {
      // Gọi API...
      deleteTemplateAPI(templateId).then(() => {
        toast.success("Template deleted successfully!");
        // Cập nhật lại danh sách templates sau khi xóa thành công
        setTemplates(
          templates.filter((template) => template._id !== templateId)
        );
      });
    });
  };
  return (
    <div className="container">
      <Box
        sx={{
          fontSize: "16px",
          fontWeight: "900",
          margin: "10px 0 30px 20px",
          mt: 2,
        }}>
        <CollectionsSharpIcon sx={{ mr: 1 }} /> Templates Categories
      </Box>
      <Box flexGrow={1} sx={{ ml: 2, mb: 2 }}>
        <Grid
          container
          spacing={{ xs: 3, sm: 3, md: 4 }}
          columnSpacing={{ xs: 0, sm: 3, md: 3 }}
          columns={{ xs: 8, sm: 10, md: 24 }}>
          {/* Render các template */}
          {templates.map((template) => (
            <Grid key={template._id} size={{ xs: 8, sm: 5, md: 8 }}>
              <CustomCardMedia
                template={template}
                onShareTemplate={() => {}}
                handleDeleteTemplate={handleDeleteTemplate}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default TemplatesPage;
