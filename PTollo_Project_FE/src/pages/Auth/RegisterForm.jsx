import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import LockIcon from "@mui/icons-material/Lock";
import Typography from "@mui/material/Typography";
import { Card as MuiCard } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import TextField from "@mui/material/TextField";
import Zoom from "@mui/material/Zoom";
import PtolloIcon from "~/assets/ptollo.svg?react";
import Divider from "@mui/material/Divider";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import IconButton from "@mui/material/IconButton";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useForm } from "react-hook-form";
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_CONFIRMATION_MESSAGE,
} from "~/utils/validators";
import FieldErrorAlert from "~/components/Form/FieldErrorAlert";
import { registerUserAPI } from "~/apis";
import { toast } from "react-toastify";
import { useState } from "react";

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConf, setshowPasswordConf] = useState(false);
  const submitRegister = (data) => {
    const { email, password } = data;
    toast
      .promise(registerUserAPI({ email, password }), {
        pending: "Registration is in progress...",
      })
      .then((user) => {
        navigate(`/login?registeredEmail=${user.email}`);
      })
      .catch();
  };
  return (
    <form onSubmit={handleSubmit(submitRegister)}>
      <Zoom in={true} style={{ transitionDelay: "200ms" }}>
        <MuiCard
          sx={{
            minWidth: 380,
            maxWidth: 380,
            marginTop: "6em",
            marginBottom: "2em",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            boxShadow: 3,
          }}>
          <Box
            sx={{
              margin: "1em",
              display: "flex",
              justifyContent: "center",
              gap: 1,
            }}>
            <Avatar sx={{ bgcolor: "#0991B2" }}>
              <LockIcon sx={{ color: "white" }} />
            </Avatar>
            <Avatar sx={{ bgcolor: "#0991B2" }}>
              <PtolloIcon />
            </Avatar>
          </Box>
          <Box
            sx={{
              marginTop: "1em",
              display: "flex",
              justifyContent: "center",
              color: (theme) => theme.palette.grey[500],
            }}>
            Author: PTollo-Team
          </Box>
          <Box sx={{ padding: "0 1em 1em 1em" }}>
            <Box sx={{ marginTop: "1em" }}>
              <TextField
                // autoComplete="nope"
                autoFocus
                fullWidth
                label="Enter Email..."
                type="text"
                variant="outlined"
                error={!!errors["email"]}
                {...register("email", {
                  //kiểm tra xem có nhập email không và có đúng định dạng email không
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE,
                  },
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={"email"} />
            </Box>
            <Box sx={{ marginTop: "1em" }}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  label="Enter Password..."
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  error={!!errors["password"]}
                  {...register("password", {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: PASSWORD_RULE,
                      message: PASSWORD_RULE_MESSAGE,
                    },
                  })}
                />
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: "15%",
                    color: "white",
                  }}>
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )}
                </IconButton>
              </Box>
              <FieldErrorAlert errors={errors} fieldName={"password"} />
            </Box>
            <Box sx={{ marginTop: "1em" }}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  fullWidth
                  label="Enter Password Confirmation..."
                  type={showPasswordConf ? "text" : "password"}
                  variant="outlined"
                  error={!!errors["passwordConfirmation"]}
                  {...register("passwordConfirmation", {
                    required: FIELD_REQUIRED_MESSAGE,
                    validate: (value) => {
                      if (value === watch("password")) return true;
                      return PASSWORD_CONFIRMATION_MESSAGE;
                    },
                  })}
                />
                <IconButton
                  onClick={() => setshowPasswordConf(!showPasswordConf)}
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: "15%",
                    color: "white",
                  }}>
                  {showPasswordConf ? (
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )}
                </IconButton>
              </Box>
              <FieldErrorAlert
                errors={errors}
                fieldName={"passwordConfirmation"}
              />
            </Box>
          </Box>
          <CardActions sx={{ padding: "0 1em 1em 1em" }}>
            <Button
              className="interceptor-loading"
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#0991B2",
              }}
              size="large"
              fullWidth>
              Register
            </Button>
          </CardActions>
          <Box
            sx={{
              padding: "0 1em 0em 1em",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              gap: 1,
            }}>
            <Typography>Already have an account?</Typography>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <Typography
                sx={{ color: "primary.main", "&:hover": { color: "#ffbb39" } }}>
                Log in!
              </Typography>
            </Link>
          </Box>
          <Box sx={{ px: 3 }}>
            {/* Dòng phân cách "Or sign in with" */}
            <Box display="flex" alignItems="center" my={2}>
              <Divider
                sx={{
                  flexGrow: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                }}
              />
              <Typography
                variant="body2"
                sx={{ px: 3, color: "white", opacity: 0.75 }}>
                Or sign in with
              </Typography>
              <Divider
                sx={{
                  flexGrow: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                }}
              />
            </Box>

            {/* Nút Login với Google */}
            <Button
              variant="outlined"
              fullWidth
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 1.5,
                mb: 2,
                borderColor: "white",
                color: "white",
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                },
              }}
              startIcon={<GoogleIcon />}>
              Login with Google
            </Button>

            {/* Nút Login với Facebook */}
            <Button
              variant="outlined"
              fullWidth
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 1.5,
                mb: 2,
                borderColor: "white",
                color: "white",
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                },
              }}
              startIcon={<FacebookIcon />}>
              Login with Facebook
            </Button>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  );
}

export default RegisterForm;
