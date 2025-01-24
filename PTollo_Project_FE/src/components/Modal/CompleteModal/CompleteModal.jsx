import { useState } from "react";
import Grid from "@mui/material/Grid2";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import CloseIcon from "@mui/icons-material/Close";
import { Bar, Doughnut, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Divider } from "@mui/material";

ChartJS.register(
  BarElement,
  ArcElement,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement
);

const CompleteModal = ({ open, onClose, completionData }) => {
  const [chartType, setChartType] = useState("Doughnut"); // Kiểu biểu đồ hiện tại
  const { completionRate, columnCompletion, overDueRate } = completionData;

  // Dữ liệu cho biểu đồ tổng
  const boardChartData = {
    labels: ["Overdue", "Completed", "No Deadline"],
    datasets: [
      {
        label: "Completion Rate (%)",
        data: [overDueRate, completionRate, 100 - completionRate - overDueRate],
        backgroundColor: ["#C62300", "#3E7B27", "#FCC737"], // Màu cho các phần tử
        borderColor: "#FFFDF0", // Cập nhật màu viền
        borderWidth: 2, // Độ dày đường kẻ
        tension: 0.4, // Độ cong của đường Line
        fill: false, // Không đổ màu phía dưới Line
      },
    ],
  };
  // Dữ liệu cho biểu đồ Stacked Bar Chart
  const stackedBarChartData = {
    labels: columnCompletion.map((col) => col.columnTitle), // Tên các cột
    datasets: [
      {
        label: "Overdue",
        data: columnCompletion.map((col) => col.overDueRate),
        backgroundColor: "#C62300",
      },
      {
        label: "Completed",
        data: columnCompletion.map((col) => col.completionRate),
        backgroundColor: "#3E7B27",
      },
      {
        label: "No Deadline",
        data: columnCompletion.map(
          (col) => 100 - col.completionRate - col.overDueRate
        ),
        backgroundColor: "#FCC737",
      },
    ],
  };

  const stackedBarChartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) =>
            `${tooltipItem.dataset.label}: ${tooltipItem.raw}%`,
        },
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Columns",
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Completion Rate (%)",
        },
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };
  const chartComponents = {
    Doughnut: Doughnut,
    Pie: Pie,
    Bar: Bar,
    Line: Line,
  };

  const ChartComponent = chartComponents[chartType];

  return (
    <Modal
      disableScrollLock
      open={open}
      onClose={onClose}
      sx={{ overflowY: "auto" }}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          maxHeight: "90vh",
          overflowY: "auto",
        }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Board Completion Details</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Bộ chọn kiểu biểu đồ */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="chart-type-select-label">Chart Type</InputLabel>
          <Select
            labelId="chart-type-select-label"
            value={chartType}
            label="Chart Type"
            onChange={(e) => setChartType(e.target.value)}>
            <MenuItem value="Doughnut">Doughnut</MenuItem>
            <MenuItem value="Pie">Pie</MenuItem>
            <MenuItem value="Bar">Bar</MenuItem>
            <MenuItem value="Line">Line</MenuItem>
          </Select>
        </FormControl>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            flexDirection: "column",
          }}>
          {/* Biểu đồ tổng của board */}
          <Typography variant="h6" align="center" gutterBottom>
            Board Completion
          </Typography>

          <Box sx={{ width: "500px", margin: "auto", align: "center" }}>
            <ChartComponent data={boardChartData} />
          </Box>
          {/* Biểu đồ Stacked Bar Chart */}
          <Typography variant="h6" sx={{ mt: 5 }} align="center">
            Stacked Bar Chart of Column Completion
          </Typography>
          <Box sx={{ width: "100%", mt: 2 }}>
            <Bar data={stackedBarChartData} options={stackedBarChartOptions} />
          </Box>
        </Box>

        {/* Thông tin và biểu đồ của từng column */}
        <Typography variant="h6" sx={{ mt: 4 }}>
          Column Completion
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {columnCompletion.map((col) => {
            const columnChartData = {
              labels: ["Overdue", "Completed", "No Deadline"],
              datasets: [
                {
                  label: `${col.columnTitle} Completion Rate (%)`,
                  data: [
                    col.overDueRate,
                    col.completionRate,
                    100 - col.completionRate - col.overDueRate,
                  ],
                  backgroundColor: ["#C62300", "#3E7B27", "#FCC737"],
                  borderColor: "#FFFDF0", // Cập nhật màu viền
                  borderWidth: 2,
                  tension: 0.4,
                  fill: false,
                },
              ],
            };

            return (
              <Grid item size={6} key={col.columnId}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    bgcolor: "background.paper",
                  }}>
                  <Typography variant="subtitle1" align="center" gutterBottom>
                    {col.columnTitle}
                  </Typography>
                  <ChartComponent data={columnChartData} />
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{ mt: 1, color: "text.secondary" }}>
                    {`Completed: ${col.completedCards} / ${col.totalCards}`}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Modal>
  );
};

export default CompleteModal;
