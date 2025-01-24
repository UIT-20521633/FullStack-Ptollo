import { GrProjects } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import "~/index.css";
const NavBarLandingPage = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex items-left justify-left">
      <div className="flex items-center">
        <GrProjects
          size={"24px"}
          color=""
          className="ml-6 mt-3.5 cursor-pointer"
        />
        <div className="ml-2 mt-3.5 text-[20px] font-bold">PTollo</div>
      </div>
      <ul className="ml-auto text-16 font-semibold">
        <button
          onClick={() => navigate("/signup")}
          className="mt-3.5 px-2 py-1 bg-white/35 text-white text-11 font-medium rounded-md hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
          SIGN UP
        </button>

        <button
          className="mr-3 ml-2 px-2 py-1 bg-white/35 text-white text-11 font-medium rounded-md hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          onClick={() => navigate("/login")}>
          LOGIN
        </button>
      </ul>
    </nav>
  );
};

export default NavBarLandingPage;
