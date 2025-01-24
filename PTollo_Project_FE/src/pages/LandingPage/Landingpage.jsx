import NavBarLandingPage from "../../components/NavBar/NavBarLandingPage";
import Slogan from "../../components/Slogon/Slogan";
import "~/index.css";
import backgroundImage from "../../../src/assets/img/Landingpage_img/background.jpg";
function Landingpage() {
  return (
    <div
      className="font-sora h-screen bg-cover bg-center bg-no-repeat  from-purple-900 to-purple-700 text-white"
      style={{
        background: `url(${backgroundImage})`,
      }}>
      <NavBarLandingPage />
      <Slogan />
    </div>
  );
}

export default Landingpage;
