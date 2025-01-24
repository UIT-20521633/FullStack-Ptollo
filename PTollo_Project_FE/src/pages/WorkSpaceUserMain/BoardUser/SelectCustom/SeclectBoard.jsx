import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";

export default function SeclectBoard() {
  const [sort, setSort] = React.useState("Most");

  const handleChange = (event) => {
    setSort(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 250 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-multiple-name-label">Sort by</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          value={sort}
          label="Sort"
          input={<OutlinedInput label="Sort by" />}
          onChange={handleChange}>
          <MenuItem value={"Most"}>Most recently active</MenuItem>
          <MenuItem value={"Least"}>Least recently active</MenuItem>
          <MenuItem value={"A-Z"}>Alphabetically A-Z</MenuItem>
          <MenuItem value={"Z-A"}>Alphabetically Z-A</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
