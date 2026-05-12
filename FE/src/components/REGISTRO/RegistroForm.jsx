// src/components/REGISTRO/RegistroForm.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/authService';

const RegistroForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Por favor, ingresa un email válido.');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await registerUser({ name, email, password });
            navigate('/login');
        } catch (err) {
            setError('Ocurrió un error al registrarse. Inténtelo de nuevo más tarde.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <h2>Crear Cuenta</h2>
            <p className="auth-subtitle">Únete a Raíces del Golfo</p>
            
            {error && (
                <div className="error-message" role="alert">
                    <span>⚠️</span> {error}
                </div>
            )}
            
            <form onSubmit={handleRegister} noValidate>
                <div className="input-group">
                    <label htmlFor="name">Nombre completo</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Juan Pérez"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        required
                        aria-label="Nombre completo"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        autoComplete="email"
                        required
                        aria-label="Correo electrónico"
                    />
                </div>
                
                <div className="input-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        autoComplete="new-password"
                        required
                        aria-label="Contraseña"
                    />
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Creando cuenta...' : 'Registrarse'}
                </button>
            </form>
            
            <div className="auth-options">
                <p>
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" aria-label="Ir a iniciar sesión">
                        Inicia sesión aquí
                    </Link>
                </p>
                <p>
                    <Link to="/" aria-label="Volver al inicio">
                        ← Volver al Inicio
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegistroForm;
