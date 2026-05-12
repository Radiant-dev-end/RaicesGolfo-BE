import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SharkLogo from '../common/SharkLogo';
import './NavbarCliente.css';

function NavbarCliente() {
  const [userName, setUserName] = useState('Cliente');
  const [userPhoto, setUserPhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.name) setUserName(user.name);
        else if (user.email) setUserName(user.email.split('@')[0]);
        if (user.photo) setUserPhoto(user.photo);
      } catch (e) {
        console.error("Error al leer usuario", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar-cliente">
      <div className="navbar-cliente-container">
        <div className="navbar-cliente-logo">
          <Link to="/">
            <SharkLogo color="#0d9488" suffix="Cliente" />
          </Link>
        </div>

        <div className="navbar-cliente-actions">
           {/* Perfil del Usuario */}
           <div className="cliente-profile">
             <div className="avatar">
               {userPhoto ? (
                 <img src={userPhoto} alt="Profile" className="avatar-img" />
               ) : (
                 userName.substring(0, 2).toUpperCase()
               )}
             </div>
             <span className="cliente-name">{userName}</span>
           </div>

           {/* Botón Salir */}
           <button onClick={handleLogout} className="btn-logout">
             Salir
           </button>
        </div>
      </div>
    </nav>
  );
}

export default NavbarCliente;
