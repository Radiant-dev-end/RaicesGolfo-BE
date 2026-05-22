import OlvideContrasena from "../components/LOGIN/OlvideContrasena";
import SharkLogo from "../components/common/SharkLogo";
import "../styles/Auth.css";

function OlvideContrasenaPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <OlvideContrasena />
        <div className="auth-info-container">
          <SharkLogo color="white" />
          <p>Recupera el acceso a tu cuenta en segundos.</p>
        </div>
      </div>
    </div>
  );
}

export default OlvideContrasenaPage;
