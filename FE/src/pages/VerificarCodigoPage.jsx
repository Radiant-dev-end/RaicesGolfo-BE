import VerificarCodigo from "../components/LOGIN/VerificarCodigo";
import SharkLogo from "../components/common/SharkLogo";
import "../styles/Auth.css";

function VerificarCodigoPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <VerificarCodigo />
        <div className="auth-info-container">
          <SharkLogo color="white" />
          <p>Ingresa el código para continuar con el restablecimiento.</p>
        </div>
      </div>
    </div>
  );
}

export default VerificarCodigoPage;
