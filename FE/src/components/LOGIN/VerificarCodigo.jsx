import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { verifyRecoveryCode, validateCodeAndResetPassword } from '../../services/authService';

const VerificarCodigo = () => {
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedEmail = sessionStorage.getItem('resetEmail');
        if (!savedEmail) {
            Swal.fire({
                icon: 'info',
                title: 'Correo necesario',
                text: 'Por favor, ingresa tu correo primero.',
                confirmButtonColor: '#008080'
            });
            navigate('/olvide-contrasena');
        } else {
            setEmail(savedEmail);
        }
    }, [navigate]);

    // Paso 1: Verificar el código
    const handleVerifyCode = async () => {
        if (!code || code.length !== 6) {
            Swal.fire({
                icon: 'error',
                title: 'Código incompleto',
                text: 'Por favor, ingresa el código de 6 dígitos enviado a tu correo.',
                confirmButtonColor: '#008080'
            });
            return;
        }

        try {
            setLoading(true);
            await verifyRecoveryCode(email, code);
            setCodeVerified(true);

            Swal.fire({
                icon: 'success',
                title: '¡Código Correcto!',
                text: 'Ahora puedes establecer tu nueva contraseña.',
                timer: 2000,
                showConfirmButton: false,
                confirmButtonColor: '#008080'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Código Inválido',
                text: error.message || 'El código no es válido o ha expirado.',
                confirmButtonColor: '#008080'
            });
        } finally {
            setLoading(false);
        }
    };

    // Paso 2: Restablecer la contraseña
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword.length < 8) {
            Swal.fire({
                icon: 'error',
                title: 'Contraseña débil',
                text: 'La contraseña debe tener al menos 8 caracteres.',
                confirmButtonColor: '#008080'
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'No coinciden',
                text: 'Las contraseñas ingresadas no son iguales.',
                confirmButtonColor: '#008080'
            });
            return;
        }

        try {
            setLoading(true);
            await validateCodeAndResetPassword(email, code, newPassword, confirmPassword);

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión.',
                confirmButtonColor: '#008080'
            });

            // Limpiar sesión
            sessionStorage.removeItem('resetEmail');

            navigate('/login');
        } catch (error) {
            console.error('Error al restablecer:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar',
                text: error.message || 'No se pudo actualizar la contraseña. Reintenta el proceso.',
                confirmButtonColor: '#008080'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-container" style={{ animation: 'fadeIn 0.5s ease' }}>
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>

            <h2>{codeVerified ? 'Nueva Contraseña' : 'Verificar Identidad'}</h2>
            <p className="auth-subtitle">
                {codeVerified
                    ? 'Escribe tu nueva contraseña para recuperar el acceso.'
                    : `Hemos enviado un código de 6 dígitos a ${email}`
                }
            </p>

            {/* ── PASO 1: Verificar el código ── */}
            {!codeVerified && (
                <div>
                    <div className="input-group">
                        <label htmlFor="verify-code">Código de Verificación</label>
                        <input
                            id="verify-code"
                            type="text"
                            placeholder="000000"
                            value={code}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setCode(val);
                            }}
                            disabled={loading}
                            maxLength={6}
                            required
                            style={{ 
                                letterSpacing: '8px', 
                                textAlign: 'center', 
                                fontSize: '1.5rem', 
                                fontWeight: 700,
                                color: '#008080'
                            }}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleVerifyCode}
                        disabled={loading || code.length !== 6}
                        style={{ marginTop: '1.5rem', width: '100%' }}
                    >
                        {loading ? 'Verificando...' : 'Verificar Código'}
                    </button>
                </div>
            )}

            {/* ── PASO 2: Crear nueva contraseña ── */}
            {codeVerified && (
                <form onSubmit={handleResetPassword}>
                    <div className="input-group">
                        <label htmlFor="newPassword">Nueva Contraseña</label>
                        <input
                            id="newPassword"
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={loading}
                            minLength={8}
                            required
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
                            disabled={loading}
                            minLength={8}
                            required
                            style={confirmPassword && newPassword !== confirmPassword ? { borderColor: '#ef4444' } : {}}
                        />
                        {confirmPassword && newPassword !== confirmPassword && (
                            <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '5px', display: 'block' }}>
                               ⚠️ Las contraseñas no coinciden
                            </span>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || newPassword !== confirmPassword || newPassword.length < 8}
                        style={{ marginTop: '1rem' }}
                    >
                        {loading ? 'Restableciendo...' : 'Guardar Nueva Contraseña'}
                    </button>
                </form>
            )}

            <div className="auth-options">
                {!codeVerified ? (
                    <p>
                        ¿No recibiste el código? <Link to="/olvide-contrasena">Intentar de nuevo</Link>
                    </p>
                ) : (
                    <p>
                        <button 
                           onClick={() => setCodeVerified(false)} 
                           style={{ background: 'none', border: 'none', color: '#008080', cursor: 'pointer', padding: 0, fontSize: '0.9rem', textDecoration: 'underline' }}
                        >
                            Corregir código
                        </button>
                    </p>
                )}
                <p style={{ marginTop: '0.5rem' }}>
                    <Link to="/login" style={{ fontSize: '0.9rem' }}>← Cancelar y volver al Login</Link>
                </p>
            </div>
        </div>
    );
};

export default VerificarCodigo;
