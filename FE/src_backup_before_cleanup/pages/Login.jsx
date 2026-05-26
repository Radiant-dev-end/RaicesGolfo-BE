import Inicioseccion from "../components/LOGIN/Inicioseccion";
import { Link } from "react-router-dom";
import SharkLogo from "../components/common/SharkLogo";
import "../styles/Auth.css";

function Login() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <Inicioseccion />
        <div className="auth-info-container">
          <SharkLogo color="white" />
          <p>Descubre la belleza del Golfo de Nicoya. Un paraíso natural te espera.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
