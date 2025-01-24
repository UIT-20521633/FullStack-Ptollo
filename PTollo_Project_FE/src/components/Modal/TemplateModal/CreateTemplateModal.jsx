import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { createNewTemplateAPI } from "~/apis";
import { toast } from "react-toastify";

const CreateTemplateModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    background: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNewTemplateAPI(formData);
      onClose(); // Đóng modal sau khi tạo thành công
    } catch (err) {
      toast.error("Failed to create template");
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
      <h2>Create New Template</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData?.title}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData?.description}
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
          value={formData?.background}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Create
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

export default CreateTemplateModal;
