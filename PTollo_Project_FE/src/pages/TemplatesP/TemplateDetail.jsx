import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import PageLoadingSpinner from "~/components/Loading/PageLoadingSpinner";
import TemplateBar from "./TemplateBar/TemplateBar";
import TemplateContent from "./TemplateContent/TemplateContent";
import {
  fetchTemplateDetailsAPI,
  selectActiveTemplate,
} from "~/redux/activeTemplate/activeTemplateSlice";

const TemplateDetail = () => {
  const { id } = useParams(); // Lấy ID của template từ URL
  const dispatch = useDispatch();
  const template = useSelector(selectActiveTemplate);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchTemplateDetailsAPI(id)); // Gọi API để lấy dữ liệu của board
    setLoading(false); // Tắt trạng thái loading sau khi dữ liệu được tải
  }, [dispatch, id]);

  if (loading || !template) {
    return <PageLoadingSpinner caption="Loading Template..." />;
  }

  return (
    <Box
      sx={{
        height: "100vh",
        background: template.background.startsWith("#")
          ? template.background
          : `url(${template.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      {/* Thanh công cụ của Board */}
      <TemplateBar template={template} />
      {/* Nội dung chính của Board */}
      <TemplateContent template={template} />
    </Box>
  );
};

export default TemplateDetail;
