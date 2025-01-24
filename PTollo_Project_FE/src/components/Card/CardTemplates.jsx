import { useState } from "react";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import BoardBar from "../../pages/Boards/BoardBar/BoardBar";

const CardTemplates = ({ title, srcImage, showIcon = false }) => {
  const [isMarked, setIsMarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleMark = () => {
    setIsMarked(!isMarked);
  };

  return (
    <div
      className="card text-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: "#323C43",
        margin: "10px 10px 20px 15px",
        backgroundImage: `url(${srcImage})`,
        maxWidth: "300px",
        maxHeight: "96px",
        minWidth: "135px",
        minHeight: "96px",
        borderRadius: "6px",
        border: "none",
        position: "relative",
        width: "100%",
        overflow: "hidden",
      }}>
      <div
        className="card-body"
        style={{
          backgroundColor: "#323C43",
          display: "flex",
          flexDirection: "column",
          justifyContent: showIcon ? "flex-end" : "flex-start", // Đặt vị trí tiêu đề
          backgroundImage: `url(${srcImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "6px",
          position: "relative",
          zIndex: 1,
        }}>
        {showIcon && (
          <button
            className="btn btn-secondary btn-template"
            style={{
              width: "100px",
              height: "17px",
              fontSize: "11px",
              padding: "0px 5px",
              visibility: showIcon ? "visible" : "hidden",
              zIndex: 3,
            }}>
            Templates
          </button>
        )}
        <h6 className="card-title text-white my-1 font-medium">{title}</h6>
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          transform: isHovered ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 1,
        }}>
        <div
          onClick={handleToggleMark}
          style={{
            position: "absolute",
            bottom: "5px",
            right: "5px",
            cursor: "pointer",
            zIndex: 2,
          }}>
          {isMarked ? (
            <StarRoundedIcon sx={{ color: "yellow" }} />
          ) : (
            <StarBorderRoundedIcon sx={{ color: "white" }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CardTemplates;
