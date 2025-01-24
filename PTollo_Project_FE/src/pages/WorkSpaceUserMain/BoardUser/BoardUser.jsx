import { Box, Avatar, IconButton, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid2";
import CardTemplates from "~/components/Card/CardTemplates";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import theme from "~/theme";
import "../../BoardsPage/BoardPage.css";
import SeclectBoard from "./SelectCustom/SeclectBoard";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
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

const BoardUser = () => {
  return (
    <div className="container">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "0px 8px 2px",
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
        <Box sx={{ px: 2 }}>
          <Button
            variant="contained"
            startIcon={<GroupAddOutlinedIcon sx={{ ml: 0 }} />}>
            Invite Workspace members
          </Button>
        </Box>
      </Box>
      <hr />
      <Box
        sx={{ fontSize: "24px", fontWeight: "500", ml: 4 }}
        className="homeTitle">
        Board
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          my: 2,
        }}>
        <Box sx={{ mx: 2 }}>
          <SeclectBoard />
        </Box>
        <Box>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-search">Search</InputLabel>
            <OutlinedInput
              id="outlined-adornment-search"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ ml: 0 }} />
                </InputAdornment>
              }
              label="Search"
            />
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid
          maxWidth="1000px"
          container
          spacing={1}
          columns={{ xs: 4, sm: 9, md: 12 }}>
          <Grid size={{ xs: 2, sm: 3, md: 3 }}>
            <ButtonCreateBoard />
          </Grid>
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
        </Grid>
      </Box>

      <div className="text-start mx-2 my-1">
        <ColorButton sx={{ fontSize: "12px" }}>View closed board</ColorButton>
      </div>
    </div>
  );
};

export default BoardUser;
