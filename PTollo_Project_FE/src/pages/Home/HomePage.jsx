import Box from "@mui/material/Box";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Typography from "@mui/material/Typography";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid2";
import ListHomePage from "./ListHomePage/ListHomePage";

const HomePage = () => {
  return (
    <div className="container">
      {/* Tiêu đề */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          ml: 2,
          mt: 2,
        }}>
        <TaskAltIcon sx={{ mr: 1.5 }} />
        <Typography variant="h6">Your Items</Typography>
        <WorkHistoryIcon sx={{ ml: 1.5 }} />
      </Box>
      {/* Nội dung */}
      <Box
        sx={{
          my: 2,
          mx: 3,
        }}>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid size="auto" container justifyContent="center">
            <Box>
              <Typography variant="subtitle1" align="center">
                When you’re added to a checklist item, it’ll show up here.
              </Typography>
              <Box align="center">
                <Card sx={{ maxWidth: 345, mt: 2 }}>
                  <CardMedia
                    component="img"
                    sx={{
                      borderRadius: "4px 4px 0px 0px",
                      width: "100%",
                      height: "108px",
                      minHeight: "100px",
                    }}
                    yarnb
                    image="HomePage/HomePageContent.svg"
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Lizard
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}>
                      Lizards are a widespread group of squamate reptiles, with
                      over 6,000 species, ranging across all continents except
                      Antarctica.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Grid>
          <Grid
            size={6}
            justifyContent="center"
            sx={{
              display: {
                xs: "none",
                lg: "block",
              },
              ml: 10,
            }}>
            <ListHomePage />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default HomePage;
