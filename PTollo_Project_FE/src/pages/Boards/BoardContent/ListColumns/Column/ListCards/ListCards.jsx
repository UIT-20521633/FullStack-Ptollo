import Box from "@mui/material/Box";
import CardBoard from "./CardBoard/CardBoard";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
const ListCards = ({ cards }) => {
  return (
    <SortableContext
      items={cards?.map((card) => card._id)}
      strategy={verticalListSortingStrategy}>
      <Box
        sx={{
          p: "0 5px 5px 5px",
          m: "0 5px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflowX: "hidden",
          overflowY: "auto",
          maxHeight: (theme) =>
            `calc(
        ${theme.Ptollo.boardContentHeight} - 
        ${theme.spacing(4.5)} - 
        ${theme.Ptollo.columnHeaderHeight} - 
        ${theme.Ptollo.columnFooterHeight}  
        )`,
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: (theme) =>
              theme.palette.mode == "dark" ? "#ecf0f1" : "1A1D20",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: (theme) =>
              theme.palette.mode == "dark" ? "white" : "#bdc3c7",
          },
        }}>
        {cards?.map((card) => (
          <CardBoard key={card._id} card={card} />
        ))}
      </Box>
    </SortableContext>
  );
};
export default ListCards;
