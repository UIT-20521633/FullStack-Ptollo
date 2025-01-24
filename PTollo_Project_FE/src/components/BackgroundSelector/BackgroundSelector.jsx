import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import BurstModeIcon from "@mui/icons-material/BurstMode";
import { SketchPicker } from "react-color";
import {
  getImagesAPI,
  searchImagesAPI,
  uploadBackgroundBoardAPI,
} from "~/apis";
import CircularProgress from "@mui/material/CircularProgress";
import VisuallyHiddenInput from "~/components/Form/VisuallyHiddenInput";
import { FileUploader } from "react-drag-drop-files";
import { singleFileValidator } from "~/utils/validators";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

const BackgroundSelector = ({ boardId, onSave }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [backgroundType, setBackgroundType] = useState("color");
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const [query, setQuery] = useState("");

  const fetchUnsplashImages = async (query = "car") => {
    try {
      const response = await searchImagesAPI(query);
      setImages(response);
    } catch (error) {
      console.error("Error fetching Unsplash images:", error);
    }
  };
  const handleSearch = () => {
    if (query.trim()) {
      fetchUnsplashImages(query.trim());
    } else {
      toast.warning("Please enter a search query.");
    }
  };
  // Fetch Unsplash images
  useEffect(() => {
    setLoadingImages(true);
    getImagesAPI()
      .then((data) => {
        setImages(data);
        setLoadingImages(false);
      })
      .catch(() => setLoadingImages(false));
  }, []);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedFile(null);
    setUploadedImageUrl("");
  };

  const handleSave = () => {
    let background = selectedColor;
    // nếu backgroundType là gallery và uploadedImageUrl có giá trị thì set background = uploadedImageUrl (đường dẫn ảnh đã upload)
    if (backgroundType === "gallery" && uploadedImageUrl) {
      background = uploadedImageUrl;
    } else if (backgroundType.startsWith("http")) {
      // If background is an image from Unsplash
      background = backgroundType;
    }
    onSave(background);
    handleClose();
  };

  const handleFileChange = (event) => {
    const error = singleFileValidator(event.target.files[0]);
    if (error) {
      toast.error(error);
      return;
    }
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning("Please select a file to upload!");
      return;
    }
    const formData = new FormData();
    formData.append("background", selectedFile);
    setUploading(true);
    try {
      await uploadBackgroundBoardAPI(formData, boardId).then((response) => {
        // Call onSave with the uploaded image URL
        onSave(response?.background);
        setUploadedImageUrl(response?.background);
        toast.success("Image uploaded successfully!");
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    }
    // Reset selected file
    setSelectedFile(null);
    setUploading(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "background-selector-popover" : undefined;

  return (
    <>
      <Tooltip title="Change Background" arrow>
        <Button
          onClick={handleOpen}
          variant="contained"
          startIcon={
            <BurstModeIcon
              sx={{
                color: (theme) =>
                  theme.palette.mode === "dark" ? "white" : "#616161",
              }}
            />
          }
          sx={{
            textTransform: "none",
            "&:hover": { borderColor: "white" },
            backgroundColor: "#172B4D",
            color: "white",
          }}>
          Change Background
        </Button>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}>
        <Box
          sx={{
            py: 2,
            px: 2,
            width: 340,
            display: "flex",
            gap: 1,
            flexDirection: "column",
          }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "500",
              textAlign: "center",
              mt: 1,
              paddingBottom: 1,
              borderBottom: "2px solid #e0e0e0",
            }}>
            Choose Background
          </Typography>
          <Box sx={{ display: "flex", gap: 1, marginBottom: 2 }}>
            <Button
              sx={{
                height: "96px",
                borderRadius: "8px",
                width: "100%",
              }}
              variant={backgroundType === "color" ? "contained" : "outlined"}
              onClick={() => setBackgroundType("color")}>
              Color
            </Button>
            <Button
              sx={{
                height: "96px",
                borderRadius: "8px",
                width: "100%",
              }}
              variant={backgroundType === "gallery" ? "contained" : "outlined"}
              onClick={() => setBackgroundType("gallery")}>
              Unsplash
            </Button>
            <Button
              sx={{
                height: "96px",
                borderRadius: "8px",
                width: "100%",
              }}
              variant={backgroundType === "upload" ? "contained" : "outlined"}
              onClick={() => setBackgroundType("upload")}>
              Upload
            </Button>
          </Box>
          {backgroundType === "color" && (
            <Box sx={{ width: "100%", pr: 1 }}>
              <SketchPicker
                color={selectedColor}
                width="97%"
                onChangeComplete={(color) => setSelectedColor(color.hex)}
              />
            </Box>
          )}
          {backgroundType === "gallery" && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexDirection: "column",
              }}>
              <Box sx={{ display: "flex", marginBottom: 2 }}>
                <Box sx={{ width: "300px" }}>
                  <TextField
                    label="Photos"
                    variant="outlined"
                    fullWidth
                    size="small"
                    onChange={(e) => setQuery(e.target.value)}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <IconButton
                            type="button"
                            onClick={handleSearch}
                            aria-label="search"
                            size="small">
                            <SearchIcon />
                          </IconButton>
                        ),
                        sx: { pr: 0.5 },
                      },
                    }}
                    sx={{
                      display: { xs: "none", md: "inline-block" },
                      mr: 1,
                      width: "300px",
                    }}
                  />
                </Box>
              </Box>
              {loadingImages ? (
                <CircularProgress />
              ) : (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {images?.map((img) => (
                    <img
                      key={img.id}
                      src={img.url}
                      alt={img.alt}
                      style={{
                        width: "150px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border: "2px solid transparent",
                      }}
                      onClick={() => setBackgroundType(img.url)}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
          {backgroundType === "upload" && (
            <Box>
              <FileUploader
                handleChange={(file) => {
                  console.log(file);
                  setSelectedFile(file);
                }}
                name="file"
              />
              <Button
                disabled={selectedFile}
                variant="contained"
                component="label"
                fullWidth
                sx={{ mb: 1 }}>
                Upload File
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              </Button>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Choose a file to attach to the card.
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, color: "text.secondary" }}>
                Max file size is 10MB.
              </Typography>
              {uploadedImageUrl && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Uploaded Image:{" "}
                  <a href={uploadedImageUrl} target="_blank" rel="noreferrer">
                    <strong>View Image</strong>
                  </a>
                </Typography>
              )}
            </Box>
          )}
          <Box sx={{ marginTop: 2, textAlign: "right" }}>
            {backgroundType === "upload" ? (
              <Button
                className="interceptor-loading"
                onClick={handleUpload}
                variant="contained"
                color="primary"
                disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            ) : (
              <Button
                className="interceptor-loading"
                onClick={handleSave}
                variant="contained"
                disabled={backgroundType === "upload" && !uploadedImageUrl}
                color="primary">
                Save
              </Button>
            )}
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default BackgroundSelector;
