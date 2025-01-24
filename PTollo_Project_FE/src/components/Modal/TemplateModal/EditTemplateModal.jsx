import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import axios from "axios";
import { updateTemplateAPI } from "~/apis";
import { toast } from "react-toastify";

const EditTemplateModal = ({ template, onClose }) => {
  const [formData, setFormData] = useState({
    title: template?.title || "",
    description: template?.description || "",
    background: template?.background || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTemplateAPI(template.id, formData);
      onClose(); // Đóng modal sau khi chỉnh sửa thành công
    } catch (err) {
      toast.error("Failed to update template");
    }
  };

  return (
    <Box
      sx={{
        width: "400px",
        margin: "auto",
        marginTop: "100px",
        padding: "20px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: 24,
      }}>
      <h2>Edit Template</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Background URL"
          name="background"
          value={formData.background}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
        <Button
          onClick={onClose}
          sx={{ ml: 2 }}
          variant="outlined"
          color="secondary">
          Cancel
        </Button>
      </form>
    </Box>
  );
};

export default EditTemplateModal;
