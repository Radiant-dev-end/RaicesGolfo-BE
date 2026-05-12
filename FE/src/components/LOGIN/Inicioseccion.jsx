// src/components/LOGIN/Inicioseccion.jsx
// Componente de Login con UX móvil optimizado

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/authService';

const Inicioseccion = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Por favor, ingresa un email válido.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            const user = await loginUser(email, password);

            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                
                // Normalizar el rol
                const role = user.role ? user.role.toLowerCase().trim() : '';
                
                if (role === 'admin') {
                    navigate('/admin');
                } else if (role === 'cliente' || role === 'user') {
                    navigate('/cliente');
                } else {
                    navigate('/');
                }
            } else {
                setError('El correo electrónico o la contraseña son incorrectos.');
            }
        } catch (err) {
            setError('Ocurrió un error al iniciar sesión. Inténtalo de nuevo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-form-container">
            <h2>Bienvenido</h2>
            <p className="auth-subtitle">Inicia sesión en tu cuenta</p>
            
            {error && (
                <div className="error-message" role="alert">
                    <span>⚠️</span> {error}
                </div>
            )}
            
            <form onSubmit={handleLogin} noValidate>
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
                        autoComplete="current-password"
                        required
                        aria-label="Contraseña"
                    />
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
            </form>
            
            <div className="auth-options">
                <p>
                    ¿No tienes cuenta?{' '}
                    <Link to="/registro" aria-label="Ir a registro">
                        Regístrate aquí
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

export default Inicioseccion;
