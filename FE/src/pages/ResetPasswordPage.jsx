import ResetPassword from "../components/LOGIN/ResetPassword";
import SharkLogo from "../components/common/SharkLogo";
import "../styles/Auth.css";

function ResetPasswordPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <ResetPassword />
        <div className="auth-info-container">
          <SharkLogo color="white" />
          <p>Configura tu nueva contraseña para volver a explorar el Golfo.</p>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
