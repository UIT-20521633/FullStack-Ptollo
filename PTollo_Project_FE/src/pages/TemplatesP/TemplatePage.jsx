import React, { useEffect, useState } from "react";
import CustomCardMedia from "~/components/Card/CustomCardMedia";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import CollectionsSharpIcon from "@mui/icons-material/CollectionsSharp";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import CreateTemplateModal from "~/components/Modal/TemplateModal/CreateTemplateModal";
import EditTemplateModal from "~/components/Modal/TemplateModal/EditTemplateModal";
import { fetchTemplatesAPI } from "~/apis";

const TemplatePage = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);

  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => setOpenCreateModal(false);

  const handleOpenEditModal = (template) => {
    setSelectedTemplate(template);
    setOpenEditModal(true);
  };
  const handleCloseEditModal = () => {
    setSelectedTemplate(null);
    setOpenEditModal(false);
  };
  useEffect(() => {
    fetchTemplatesAPI().then((data) => {
      setTemplates(data);
    });
  }, []);

  return (
    <div className="container">
      <Box
        sx={{
          fontSize: "16px",
          fontWeight: "900",
          margin: "10px 0 30px 20px",
        }}>
        <CollectionsSharpIcon sx={{ mr: 1 }} /> Templates Categories
      </Box>
      <Box flexGrow={1} sx={{ ml: 2 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={handleOpenCreateModal}>
          Create New Template
        </Button>
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
                onUseTemplate={() => {}}
                onShareTemplate={() => {}}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Modal tạo mới */}
      <Modal open={openCreateModal} onClose={handleCloseCreateModal}>
        <Box>
          <CreateTemplateModal onClose={handleCloseCreateModal} />
        </Box>
      </Modal>

      {/* Modal chỉnh sửa */}
      <Modal open={openEditModal} onClose={handleCloseEditModal}>
        <Box>
          <EditTemplateModal
            template={selectedTemplate}
            onClose={handleCloseEditModal}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default TemplatePage;
