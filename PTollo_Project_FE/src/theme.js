import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const APP_BAR_HEIGHT = "60px";
const BOARD_BAR_HEIGHT = "53px";
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`;

const COLUMN_HEADER_HEIGHT = "50px";
const COLUMN_FOOTER_HEIGHT = "56px";

//Create a theme instance.
const theme = createTheme({
  Ptollo: {
    avatarColor: "linear-gradient(to right, #c31432, #240b36)",
    colorFont: "#b64339",
    colorNameAvatar: "#636c7c",
    marTopMenu: "12px",
    iconP: "#323c43",
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT,
  },
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "*::-webkit-scrollbar": {
            width: "3px",
            height: "3px",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdc3c7",
            borderRadius: "4px",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "white",
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        dot: {
          backgroundColor: "#19857b",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor:
            theme.palette.mode === "dark" ? "#1A1D20" : "#ecf0f1",
        }),
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor:
            theme.palette.mode === "dark" ? "#1A1D20" : "#ecf0f1",
        }),
      },
    },
    MuiListSubheader: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor:
            theme.palette.mode === "dark" ? "#1A1D20" : "#ecf0f1",
        }),
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#172B4D",
        },
        secondary: {
          main: "#19857b",
        },
        error: {
          main: red.A400,
        },
        text: {
          primary: "#172B4D", //màu chữ
          secondary: "#9FADBC", //màu chữ menu
        },
        action: {
          active: "#303C4F",
        },
        icon: "#9FADBC",
        chatButtonHover: "#cfd8dc",
        chatButton: "#cfd8dc",
        borderColor: "#263238",
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#9FADBC",
        },
        secondary: {
          main: "#D4E0EC",
        },
        error: {
          main: red.A400,
        },
        text: {
          primary: "white",
          secondary: "#9FADBC",
        },
        action: {
          active: "#D4E0EC",
        },
        icon: "#172B4D",
        chatButton: "#263238",
        chatButtonHover: "#37474f",
        borderColor: "#e0e0e0",
      },
    },
  },
});

export default theme;
