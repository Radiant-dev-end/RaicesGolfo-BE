import RegistroForm from "../components/REGISTRO/RegistroForm";
import SharkLogo from "../components/common/SharkLogo";
import "../styles/Auth.css";

function Registro() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <RegistroForm />
        <div className="auth-info-container">
          <SharkLogo color="white" />
          <p>Descubre la belleza del Golfo de Nicoya. Un paraíso natural te espera.</p>
        </div>
      </div>
    </div>
  );
}

export default Registro;
