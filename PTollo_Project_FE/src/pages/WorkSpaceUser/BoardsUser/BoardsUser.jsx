import { Box, Avatar, IconButton, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Grid from "@mui/material/Grid2";
import CardTemplates from "~/components/Card/CardTemplates";
import theme from "~/theme";
import "../../BoardsPage/BoardPage.css";
import ButtonCreateBoard from "~/components/ButtonBoard/ButtonCreateBoard";

const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.icon,
  color: theme.palette.colorButton,
  borderRadius: "2px",
  padding: "4px 8px",
  fontSize: "14px",
  fontWeight: "700",
  margin: "0px 8px",
}));

const BoardsUser = () => {
  return (
    <div className="container">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          margin: "0px 8px 20px",
          ml: 4,
        }}>
        <Avatar
          sx={{
            width: "60px",
            height: "60px",
            background: theme.Ptollo.avatarColor,
            fontWeight: "700",
            color: theme.Ptollo.colorNameAvatar,
            fontSize: "35px",
          }}
          variant="rounded">
          N
        </Avatar>
        <Box sx={{ ml: 1.5 }}>
          <Box sx={{ ml: 1, fontSize: "20px", fontWeight: "500" }}>
            namnguyen7040s Workspace 1
            <IconButton>
              <EditOutlinedIcon sx={{ mr: 1, fontSize: "16px" }} />
            </IconButton>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "12px",
              }}>
              <LockOutlinedIcon sx={{ fontSize: "14px", mr: 0.5 }} />
              Private
            </Box>
          </Box>
        </Box>
      </Box>
      <hr className="my-2" />
      {/* Starred boards */}
      <div className="starContent d-flex align-items-center">
        <PersonOutlineOutlinedIcon
          sx={{
            fontSize: 28,
            fontWeight: "900",
            mr: 1,
            marginLeft: "21px",
          }}
        />
        <Box className="homeTitle">Starred boards</Box>
      </div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          maxWidth="1000px"
          container
          spacing={1}
          columns={{ xs: 4, sm: 9, md: 12 }}
          className="starBoard">
          {["11", "12", "10", "18", "19"].map((image, index) => (
            <Grid key={index} size={{ xs: 2, sm: 3, md: 3 }}>
              <CardTemplates
                title={image ? "Project manager" : "Create new board"}
                srcImage={
                  image ? `https://picsum.photos/200/300?random=${image}` : ""
                }
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* Your board */}
      <div className="yourContent d-flex align-items-center">
        <PersonOutlineOutlinedIcon
          sx={{
            fontSize: 28,
            fontWeight: "900",
            mr: 1,
            marginLeft: "21px",
          }}
        />
        <Box className="homeTitle">Your board</Box>
      </div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          maxWidth="1000px"
          container
          spacing={1}
          columns={{ xs: 4, sm: 9, md: 12 }}>
          {["11", "17", "16", "18", "19"].map((image, index) => (
            <Grid key={index} size={{ xs: 2, sm: 3, md: 3 }}>
              <CardTemplates
                title={image ? "Project manager" : "Create new board"}
                srcImage={
                  image ? `https://picsum.photos/200/300?random=${image}` : ""
                }
              />
            </Grid>
          ))}
          <Grid size={{ xs: 2, sm: 3, md: 3 }}>
            <ButtonCreateBoard />
          </Grid>
        </Grid>
      </Box>

      <div className="text-start mx-2 my-1">
        <ColorButton sx={{ fontSize: "12px" }}>View all workspaces</ColorButton>
      </div>
    </div>
  );
};

export default BoardsUser;
