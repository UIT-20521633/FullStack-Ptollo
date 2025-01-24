import { useState, useEffect } from "react";
import Grid from "@mui/material/Gridv2";
import CustomCardMedia from "~/components/Card/CustomCardMedia";

const TemplateLibrary = () => {
  const [templates, setTemplates] = useState([]);
  const handleUseTemplate = (template) => {
    fetch("/api/boards/create-from-template", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId: template._id,
        title: `${template.title} - New Board`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(`Board created: ${data.title}`);
      })
      .catch((err) => console.error(err));
  };

  const handleShareTemplate = (template) => {
    console.log("Sharing template:", template);
  };

  useEffect(() => {
    fetch("/api/templates") // Thay bằng API thật
      .then((res) => res.json())
      .then((data) => setTemplates(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Template Library</h1>
      <Grid container spacing={2}>
        {templates.map((template) => (
          <Grid item key={template._id} xs={12} sm={6} md={4}>
            <CustomCardMedia
              template={template}
              onUseTemplate={handleUseTemplate}
              onShareTemplate={handleShareTemplate}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default TemplateLibrary;
