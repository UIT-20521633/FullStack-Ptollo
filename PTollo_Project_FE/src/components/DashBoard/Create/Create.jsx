import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import theme from "~/theme";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import CancelIcon from "@mui/icons-material/Cancel";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { FIELD_REQUIRED_MESSAGE } from "~/utils/validators";
import FieldErrorAlert from "~/components/Form/FieldErrorAlert";
import AbcIcon from "@mui/icons-material/Abc";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { createNewBoardAPI } from "~/apis";
import { useNavigate } from "react-router-dom";
const BOARD_TYPES = {
  PUBLIC: "public",
  PRIVATE: "private",
};
const Create = ({ afterCreateNewBoard }) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isOpen, setIsOpen] = useState(false);
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    setIsOpen(false);
    // Reset lại toàn bộ form khi đóng Modal
    reset();
  };
  const submitCreateNewBoard = (data) => {
    // const { title, description, type } = data;
    createNewBoardAPI(data).then(() => {
      // Bước 01: Đóng Modal
      handleCloseModal();
      // Bước 02: Thông báo đến component cha để xử lý
      //để refresh lại danh sách board
      afterCreateNewBoard();
    });
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  // Xử lý responsive
  const matches = useMediaQuery(theme.breakpoints.up("lg"));
  // console.log(matches);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Button
        variant="contained"
        sx={{ px: 2 }}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className="ButonMenu">
        {matches ? "Create" : <AddIcon sx={{ ml: 0 }} />}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        style={{ marginTop: theme.Ptollo.marTopMenu }}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          sx: { maxHeight: "190px", p: 0, maxWidth: "300px" },
        }}>
        <MenuItem
          onClick={handleOpenModal}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "17px 15px ",
          }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}>
            <DashboardCustomizeIcon />
            <Box sx={{ ml: 2, fontSize: "14px", fontWeight: "500" }}>
              Create board
            </Box>
          </Box>
          <Box
            sx={{
              display: "block",
              fontSize: "12px",
              fontWeight: "400",
              lineHeight: "16px",
              color: "#9FADBC",
              whiteSpace: "wrap",
              mt: 1, // Prevents wrapping
            }}>
            A board is made up of cards ordered on lists. Use it to manage
            projects, track information, or organize anything.
          </Box>
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/templates");
          }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "13px 15px ",
          }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}>
            <LibraryBooksIcon />
            <Box sx={{ ml: 2, fontSize: "14px", fontWeight: "500" }}>
              Start with a template
            </Box>
          </Box>
          <Box
            sx={{
              display: "block",
              fontSize: "12px",
              fontWeight: "400",
              lineHeight: "16px",
              color: "#9FADBC",
              whiteSpace: "wrap",
              mt: 1, // Prevents wrapping
            }}>
            Get started faster with a board template.
          </Box>
        </MenuItem>
      </Menu>

      <Modal
        open={isOpen}
        onClose={handleCloseModal} // chỉ sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "white",
            boxShadow: 24,
            borderRadius: "8px",
            border: "none",
            outline: 0,
            padding: "20px 30px",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#1A2027" : "white",
          }}>
          <Box
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              cursor: "pointer",
            }}>
            <CancelIcon
              color="error"
              sx={{ "&:hover": { color: "error.light" } }}
              onClick={handleCloseModal}
            />
          </Box>
          <Box
            id="modal-modal-title"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LibraryAddIcon />
            <Typography variant="h6" component="h2">
              {" "}
              Create a new board
            </Typography>
          </Box>
          <Box id="modal-modal-description" sx={{ my: 2 }}>
            <form onSubmit={handleSubmit(submitCreateNewBoard)}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <TextField
                    fullWidth
                    label="Title"
                    type="text"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AbcIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    {...register("title", {
                      required: FIELD_REQUIRED_MESSAGE,
                      minLength: {
                        value: 3,
                        message: "Min Length is 3 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Max Length is 50 characters",
                      },
                    })}
                    error={!!errors["title"]}
                  />
                  <FieldErrorAlert errors={errors} fieldName={"title"} />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    label="Description"
                    type="text"
                    variant="outlined"
                    multiline
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    {...register("description", {
                      required: FIELD_REQUIRED_MESSAGE,
                      minLength: {
                        value: 3,
                        message: "Min Length is 3 characters",
                      },
                      maxLength: {
                        value: 255,
                        message: "Max Length is 255 characters",
                      },
                    })}
                    error={!!errors["description"]}
                  />
                  <FieldErrorAlert errors={errors} fieldName={"description"} />
                </Box>

                {/*
                 * Lưu ý đối với RadioGroup của MUI thì không thể dùng register tương tự TextField được mà phải sử dụng <Controller /> và props "control" của react-hook-form như cách làm dưới đây
                 * https://stackoverflow.com/a/73336103/8324172
                 * https://mui.com/material-ui/react-radio-button/
                 */}
                <Controller
                  name="type"
                  defaultValue={BOARD_TYPES.PUBLIC}
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      row
                      onChange={(event, value) => field.onChange(value)}
                      value={field.value}>
                      <FormControlLabel
                        value={BOARD_TYPES.PUBLIC}
                        control={<Radio size="small" />}
                        label="Public"
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        value={BOARD_TYPES.PRIVATE}
                        control={<Radio size="small" />}
                        label="Private"
                        labelPlacement="start"
                      />
                    </RadioGroup>
                  )}
                />

                <Box sx={{ alignSelf: "flex-end" }}>
                  <Button
                    className="interceptor-loading"
                    type="submit"
                    variant="contained"
                    color="primary">
                    Create
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Create;
