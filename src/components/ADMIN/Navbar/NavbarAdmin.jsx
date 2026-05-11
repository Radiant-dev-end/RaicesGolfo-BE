import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SharkLogo from '../../common/SharkLogo';
import Notificaciones from '../Notificaciones/Notificaciones';
import './NavbarAdmin.css';

function NavbarAdmin({ toggleSidebar, onTabChange }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'AD';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <nav className="navbar-admin">
      <div className="navbar-admin-container">
        <div className="navbar-admin-logo">
          <button className="sidebar-toggle-btn" onClick={toggleSidebar} title="Alternar panel lateral">
            <div className="hamburger">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          </button>
          <Link to="/admin">
            <SharkLogo color="#0d9488" suffix="Admin" />
          </Link>
        </div>

        {/* Acciones de navegación a la derecha */}
        <div className="navbar-admin-actions">
           {/* Componente de Notificaciones */}
           <Notificaciones onTabChange={onTabChange} />
           
           {/* Perfil del Usuario */}
           <div
             className="admin-profile"
             onClick={() => {
               if (onTabChange) {
                 onTabChange('settings');
                 navigate('/admin');
                 return;
               }
               navigate('/admin');
             }}
           >
             <div className="avatar">
               {user?.photo ? (
                 <img src={user.photo} alt={user.name} className="avatar-img" />
               ) : (
                 getInitials(user?.name)
               )}
             </div>
             <span className="admin-name">{user?.name || 'Administrador'}</span>
           </div>

           {/* Botón Salir */}
           <button onClick={handleLogout} className="btn-logout">
             Salir
           </button>

           {/* Mobile menu icon (Hamburger) */}
           <div className="menu-icon-admin" onClick={toggleSidebar}>
             <div className="bar"></div>
             <div className="bar"></div>
             <div className="bar"></div>
           </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarAdmin;
