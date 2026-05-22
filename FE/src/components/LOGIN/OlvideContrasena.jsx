import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendRecoveryCode } from '../../services/authService';
import Swal from 'sweetalert2';

const OlvideContrasena = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');

    const navigate = useNavigate();

    const validateEmail = (value) => {
        setEmail(value);
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setEmailError('Ingresa un formato de correo válido (ej: usuario@dominio.com)');
        } else {
            setEmailError('');
        }
    };

    const handleSendCode = async (e) => {
        e.preventDefault();

        if (!email || emailError) {
            Swal.fire({
                icon: 'warning',
                title: 'Correo inválido',
                text: 'Por favor, introduce un correo electrónico correcto.',
                confirmButtonColor: '#008080'
            });
            return;
        }

        try {
            setLoading(true);

            const response = await sendRecoveryCode(email);

            Swal.fire({
                icon: 'success',
                title: '¡Código Enviado!',
                text: response.message || 'Hemos enviado un código de recuperación a tu bandeja de entrada.',
                confirmButtonColor: '#008080'
            });

            // Guardar email para el siguiente paso
            sessionStorage.setItem('resetEmail', email);

            // Redirigir a la pantalla de verificación de código
            navigate('/verificar-codigo');

        } catch (error) {
            console.error('Error:', error);
            
            Swal.fire({
                icon: 'error',
                title: 'No se pudo enviar',
                text: error.message || 'Ocurrió un problema. Inténtalo de nuevo más tarde.',
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
            
            <h2>Recuperar acceso</h2>
            <p className="auth-subtitle">
                Introduce tu correo y te enviaremos un código de seguridad para restablecer tu contraseña.
            </p>

            <form onSubmit={handleSendCode} noValidate>
                <div className="input-group">
                    <label htmlFor="forgot-email">Correo electrónico</label>
                    <input
                        id="forgot-email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={(e) => validateEmail(e.target.value)}
                        disabled={loading}
                        autoComplete="email"
                        required
                        style={emailError ? { borderColor: '#ef4444', background: '#fff1f2' } : {}}
                    />
                    {emailError && (
                        <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '5px', fontWeight: '500' }}>
                           ⚠️ {emailError}
                        </span>
                    )}
                </div>

                <button 
                    type="submit" 
                    disabled={loading || !!emailError || !email}
                    style={{ position: 'relative', overflow: 'hidden' }}
                >
                    {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="spinner-mini"></div> Enviando...
                        </div>
                    ) : 'Enviar código de recuperación'}
                </button>
            </form>

            <div className="auth-options">
                <p style={{ marginTop: '1rem' }}>
                    <Link to="/login" style={{ fontSize: '0.9rem' }}>
                        ← Regresar al inicio de sesión
                    </Link>
                </p>
            </div>

            <style>{`
                .spinner-mini {
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: #fff;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default OlvideContrasena;