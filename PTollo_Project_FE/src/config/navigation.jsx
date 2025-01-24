import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import HomeIcon from "@mui/icons-material/Home";
import Avatar from "@mui/material/Avatar";
import FavoriteBorderTwoToneIcon from "@mui/icons-material/FavoriteBorderTwoTone";
import theme from "~/theme";
// import CustomCardMedia from "../Card/CardMedia";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CardYourBoard from "~/components/Card/CardYourBoard";

export const NAVIGATION_MAIN = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "boards",
    title: "Boards",
    icon: <DashboardIcon />,
  },
  {
    segment: "templates",
    title: "Templates",
    icon: <LibraryBooksIcon />,
  },
  {
    segment: "home",
    title: "Home",
    icon: <HomeIcon />,
  },
  {
    segment: "settings",
    title: "Settings",
    icon: <SettingsIcon />,
  },
  {
    kind: "divider",
  },
];
export const NAVIGATION_USER = [
  {
    kind: "header",
    title: "Workspaces",
  },
  {
    segment: "userWorkspace",
    title: (
      <Box sx={{ fontSize: "14px", fontWeight: "600" }}>
        NamNguyen7040s <br />
        Workspace 1
      </Box>
    ),
    icon: (
      <Avatar
        sx={{
          width: "28px",
          height: "28px",
          background: theme.Ptollo.avatarColor,
          fontWeight: "700",
          color: theme.Ptollo.colorNameAvatar,
        }}
        variant="rounded">
        N
      </Avatar>
    ),
    children: [
      {
        segment: "boardUser",
        title: "Boards",
        icon: <DashboardIcon />,
      },
      {
        segment: "members",
        title: (
          <Box>
            Members
            <button className="btn" style={{ marginLeft: "100px" }}>
              <AddOutlinedIcon />
            </button>
          </Box>
        ),
        icon: <PeopleAltIcon />,
      },
      {
        segment: "settings",
        title: "Settings",
        icon: <SettingsIcon />,
      },
      {
        kind: "header",
        title: (
          <Box sx={{ fontSize: "14px", fontWeight: "600" }}>
            Workspace views
          </Box>
        ),
      },
      {
        segment: "views/table",
        title: "Table",
        icon: <ViewListOutlinedIcon />,
      },
      {
        segment: "views/calendar",
        title: "Calendar",
        icon: <CalendarMonthIcon />,
      },
      {
        kind: "header",
        title: (
          <Box sx={{ fontSize: "14px", fontWeight: "600" }}>Your boards</Box>
        ),
      },
      {
        segment: "templates-1",
        title: (
          <CardYourBoard title={"Mise-En-Place Personal Productivity System"} />
        ),
      },
      {
        segment: "templates-2",
        title: <CardYourBoard title={"dfadaD"} />,
      },
      {
        segment: "templates-2",
        title: <CardYourBoard title={"templates nam"} />,
      },

      {},
    ],
  },
];
