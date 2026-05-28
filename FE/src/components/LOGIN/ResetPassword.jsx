import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { verifyResetToken, resetPassword } from '../../services/authService';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        const checkToken = async () => {
            if (!token || !email) {
                setVerifying(false);
                setErrorMsg('El enlace de recuperación es incompleto o ha sido alterado.');
                return;
            }

            try {
                await verifyResetToken(email, token);
                setTokenValid(true);
            } catch (error) {
                console.error("Token verification failed:", error);
                setTokenValid(false);
                setErrorMsg(error.message || 'El enlace de seguridad es inválido o ha expirado.');
            } finally {
                setVerifying(false);
            }
        };

        checkToken();
    }, [token, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            Swal.fire({ 
                icon: 'warning', 
                title: 'Contraseña débil', 
                text: 'Por seguridad, usa al menos 8 caracteres.',
                confirmButtonColor: '#008080'
            });
            return;
        }

        if (password !== confirmPassword) {
            Swal.fire({ 
                icon: 'error', 
                title: 'No coinciden', 
                text: 'Las contraseñas introducidas no son iguales.',
                confirmButtonColor: '#008080'
            });
            return;
        }

        try {
            setLoading(true);
            await resetPassword(email, password, token);

            await Swal.fire({
                icon: 'success',
                title: '¡Clave actualizada!',
                text: 'Tu contraseña se ha cambiado correctamente. El sistema invalidará automáticamente el enlace anterior.',
                confirmButtonColor: '#008080'
            });

            navigate('/login');
        } catch (error) {
            Swal.fire({ 
                icon: 'error', 
                title: 'Error al actualizar', 
                text: error.message || 'No se pudo completar el cambio.',
                confirmButtonColor: '#008080'
            });
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="auth-form-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                <div className="main-spinner"></div>
                <p style={{ marginTop: '20px', color: '#64748b', fontWeight: '500' }}>Validando seguridad...</p>
                <style>{`
                    .main-spinner {
                        width: 50px;
                        height: 50px;
                        border: 4px solid #f1f5f9;
                        border-top: 4px solid #008080;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="auth-form-container" style={{ textAlign: 'center', animation: 'shake 0.4s ease' }}>
                <div style={{ background: '#fff1f2', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <span style={{ fontSize: '40px' }}>⚠️</span>
                </div>
                <h2 style={{ color: '#991b1b' }}>Acceso denegado</h2>
                <p className="auth-subtitle" style={{ color: '#b91c1c' }}>
                    {errorMsg}
                </p>
                <Link to="/olvide-contrasena" className="auth-button" style={{ display: 'inline-block', marginTop: '20px', padding: '12px 25px', backgroundColor: '#008080', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
                    Solicitar nuevo enlace
                </Link>
                <style>{`
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-10px); }
                        75% { transform: translateX(10px); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="auth-form-container" style={{ animation: 'fadeIn 0.5s ease' }}>
            <h2>Nueva Contraseña</h2>
            <p className="auth-subtitle">Crea una clave segura para proteger tu cuenta.</p>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="password">Contraseña Nueva</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Mínimo 8 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        style={{ borderLeft: '4px solid #008080' }}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Repite la contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                        style={confirmPassword && password !== confirmPassword ? { borderLeft: '4px solid #ef4444' } : { borderLeft: '4px solid #008080' }}
                    />
                    {confirmPassword && password !== confirmPassword && (
                        <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '5px' }}>
                            Las contraseñas no coinciden
                        </span>
                    )}
                </div>

                <button type="submit" disabled={loading || password !== confirmPassword || password.length < 8}>
                    {loading ? 'Procesando cambio...' : 'Confirmar y Actualizar'}
                </button>
            </form>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default ResetPassword;
