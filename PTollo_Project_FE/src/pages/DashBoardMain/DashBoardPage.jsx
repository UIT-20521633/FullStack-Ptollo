import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import CardTemplates from "~/components/Card/CardTemplates";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import "./DashBoardPage.css";
import Avatar from "@mui/material/Avatar";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import SettingsIcon from "@mui/icons-material/Settings";
import theme from "~/theme";
import Button from "@mui/material/Button";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ContactPhoneRoundedIcon from "@mui/icons-material/ContactPhoneRounded";
import { styled } from "@mui/material/styles";
import ButtonCreateBoard from "~/components/ButtonBoard/ButtonCreateBoard";
// import theme from "../../../theme";

const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.icon,
  color: theme.palette.primary.main,
  borderRadius: "2px",
  padding: "4px 8px",
  fontSize: "14px",
  fontWeight: "700",
  margin: "0px 8px",
}));
const DashBoardPage = () => {
  return (
    <Box className="container">
      {/* Starred boards */}
      <div className="starContent d-flex align-items-center">
        <StarBorderRoundedIcon
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
          minWidth="0"
          container
          spacing={1}
          columns={{ xs: 4, sm: 9, md: 12 }}
          className="starBoard">
          {["11", "12", "10"].map((image, index) => (
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
      {/* Recent viewed */}
      <div className="recentContent d-flex align-items-center">
        <AccessTimeOutlinedIcon
          sx={{
            fontSize: 28,
            fontWeight: "900",
            mr: 1,
            marginLeft: "21px",
          }}
        />
        <Box className="homeTitle">Recently viewed</Box>
      </div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          maxWidth="1000px"
          container
          spacing={1}
          columns={{ xs: 4, sm: 9, md: 12 }}
          className="starBoard">
          {["11", "12", "10", "55"].map((image, index) => (
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
      {/* Your WorkSpace */}
      <div className="workspaceContent mx-4 my-4">
        <p className="homeTitle text-start">YOUR WORKSPACES</p>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            margin: "0px 8px 2px",
          }}>
          <Avatar
            sx={{
              background: theme.Ptollo.avatarColor,
              fontWeight: "700",
              color: theme.Ptollo.colorNameAvatar,
            }}
            variant="rounded">
            N
          </Avatar>
          <Box
            sx={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
            <Box
              sx={{
                ml: 1,
                fontSize: "14px",
                fontWeight: "500",
              }}>
              NamNguyen7040s Workspace 1
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                ml: 2,
              }}>
              <Grid container spacing={1}>
                <Grid>
                  <ColorButton startIcon={<DashboardIcon sx={{ ml: 0 }} />}>
                    Boards
                  </ColorButton>
                </Grid>
                <Grid>
                  <ColorButton
                    startIcon={<GridViewRoundedIcon sx={{ ml: 0 }} />}>
                    Views
                  </ColorButton>
                </Grid>
                <Grid>
                  <ColorButton
                    startIcon={<PersonOutlineRoundedIcon sx={{ ml: 0 }} />}>
                    Members (1)
                  </ColorButton>
                </Grid>
                <Grid>
                  <ColorButton startIcon={<SettingsIcon sx={{ ml: 0 }} />}>
                    Settings
                  </ColorButton>
                </Grid>
                <Grid>
                  <ColorButton
                    startIcon={<ContactPhoneRoundedIcon sx={{ ml: 0 }} />}>
                    Call Group
                  </ColorButton>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          maxWidth="1000px"
          minWidth="0"
          container
          spacing={1}
          columns={{ xs: 4, sm: 9, md: 12 }}
          className="starBoard">
          {["11", "12", "18", "55"].map((image, index) => (
            <Grid key={index} size={{ xs: 2, sm: 3, md: 3 }}>
              <CardTemplates
                title={image ? "Project manager" : "Create new board"}
                sx={{
                  backgroundColor: theme.palette.icon,
                }}
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
    </Box>
  );
};

export default DashBoardPage;
