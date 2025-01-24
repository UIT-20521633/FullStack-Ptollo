import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

const ButtonCreateBoard = () => {
  const theme = useTheme(); // Access the current theme

  return (
    <Button
      sx={{
        backgroundColor: theme.palette.icon, // Use icon color from the palette
        margin: "10px 10px 20px 15px",
        maxWidth: "300px",
        maxHeight: "96px",
        minWidth: "135px",
        minHeight: "96px",
        borderRadius: "6px",
        border: "none",
        width: "100%",
        fontSize: "15px",
        fontWeight: "400",
        color: theme.palette.text.primary, // Use primary text color from the palette
        "&:hover": {
          backgroundColor: theme.palette.action.hover, // Use hover color from the palette
        },
      }}>
      <Box
        sx={{
          fontSize: "16px",
          fontWeight: "700",
        }}>
        Create new board
      </Box>
    </Button>
  );
};

export default ButtonCreateBoard;
