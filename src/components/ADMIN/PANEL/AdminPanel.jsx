import React, { useState, useEffect } from 'react';
import { ENDPOINTS } from '../../../config/api';
import './AdminPanel.css';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import UsuariosPanel from './UsuariosPanel';
import HabitacionesPanel from './HabitacionesPanel';
import ResevaTours from '../TOURS/ResevaTours';
import ReservasPanel from './ReservasPanel';
import ConfiguracionPanel from './ConfiguracionPanel';
import MensajesPanel from './MensajesPanel';

// Panel principal del administrador.
// Desde aqui se controla la navegacion interna del dashboard y se montan sus modulos.
function AdminPanel() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [stats, setStats] = useState({
        ingresos: 0,
        ordenes: 0,
        clientes: 0
    });
    const [loadingStats, setLoadingStats] = useState(true);

    const fetchDashboardData = async () => {
        try {
            setLoadingStats(true);
            const [usersRes, resRes] = await Promise.all([
                fetch(ENDPOINTS.USERS),
                fetch(ENDPOINTS.RESERVATIONS)
            ]);

            const users = await usersRes.json();
            const reservations = await resRes.json();

            // Cálculos Reales
            const clientesCount = users.filter(u => u.role === 'cliente').length;
            const ordenesCount = reservations.length;
            const ingresosTotal = reservations
                .filter(r => r.status === 'Aprobada') // Solo sumamos las aprobadas/pagadas
                .reduce((sum, r) => sum + (Number(r.precio) || 0), 0);

            setStats({
                ingresos: ingresosTotal,
                ordenes: ordenesCount,
                clientes: clientesCount
            });
        } catch (error) {
            console.error("Error cargando estadísticas del dashboard", error);
        } finally {
            setLoadingStats(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchDashboardData();
        }
    }, [activeTab]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Cerrar sidebar en móvil al seleccionar una pestaña
        if (window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="tab-content fade-in">
                        <h1>Dashboard</h1>
                        <p>Resumen general del sistema y estadísticas principales.</p>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Ingresos Reales</h3>
                                <p>{loadingStats ? '...' : `$${stats.ingresos.toLocaleString()}`}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Órdenes Totales</h3>
                                <p>{loadingStats ? '...' : stats.ordenes}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Clientes Registrados</h3>
                                <p>{loadingStats ? '...' : stats.clientes}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'users':
                return <UsuariosPanel />;
            case 'rooms':
                return <HabitacionesPanel />;
            case 'tours':
                return <ResevaTours />;
            case 'orders':
                return <ReservasPanel />;
            case 'settings':
                return <ConfiguracionPanel />;
            case 'messages':
                return <MensajesPanel />;
            default:
                return null;
        }
    };

    return (
        <div className="admin-panel">
            <NavbarAdmin 
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                onTabChange={handleTabChange}
            />
            <div className="admin-container">
                <aside className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
                    <div className="sidebar-header">
                        <h2>Admin Raíces del Golfo</h2>
                    </div>
                    <ul className="sidebar-menu">
                        <li>
                            <button
                                className={`sidebar-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                                onClick={() => handleTabChange('dashboard')}
                            >
                                Dashboard
                            </button>
                        </li>
                        <li>
                            <button
                                className={`sidebar-btn ${activeTab === 'users' ? 'active' : ''}`}
                                onClick={() => handleTabChange('users')}
                            >
                                Usuarios
                            </button>
                        </li>
                        <li>
                            <button
                                className={`sidebar-btn ${activeTab === 'rooms' ? 'active' : ''}`}
                                onClick={() => handleTabChange('rooms')}
                            >
                                Habitaciones
                            </button>
                        </li>
                        <li>
                            <button
                                className={`sidebar-btn ${activeTab === 'tours' ? 'active' : ''}`}
                                onClick={() => handleTabChange('tours')}
                            >
                                Tours
                            </button>
                        </li>
                        <li>
                            <button
                                className={`sidebar-btn ${activeTab === 'orders' ? 'active' : ''}`}
                                onClick={() => handleTabChange('orders')}
                            >
                                Reservaciones
                            </button>
                        </li>

                        <li>
                            <button
                                className={`sidebar-btn ${activeTab === 'settings' ? 'active' : ''}`}
                                onClick={() => handleTabChange('settings')}
                            >
                                Configuración
                            </button>
                        </li>

                        <li>
                            <button
                                className={`sidebar-btn ${activeTab === 'messages' ? 'active' : ''}`}
                                onClick={() => handleTabChange('messages')}
                            >
                                Mensajes
                            </button>
                        </li>
                    </ul>
                </aside>
                <div 
                    className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`} 
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
                <main className="main-content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default AdminPanel;
