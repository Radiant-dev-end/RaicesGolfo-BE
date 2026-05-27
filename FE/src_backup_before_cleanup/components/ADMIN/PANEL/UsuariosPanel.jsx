import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { getUsers, deleteUser, updateUserRole } from '../../../services/CrudParaUsuarios';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../common/Pagination';

const UsuariosPanel = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchId, setSearchId] = useState('');
    const [searchRole, setSearchRole] = useState('');
    const [error, setError] = useState('');

    const { 
        data: usuarios, 
        loading, 
        page, 
        setPage, 
        totalPaginas,
        refresh: cargarUsuarios
    } = usePagination(() => getUsers(), 3); // LIMIT: 3 users per page

    // Filtrar usuarios por correo, ID y rol
    const usuariosFiltrados = (usuarios || []).filter(user => {
        const matchesEmail = (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const userId = String(user.id || user.id_usuarios || '');
        const matchesId = searchId ? userId.includes(searchId) : true;
        const userRole = user.role || (user.id_roles === 1 ? 'admin' : 'cliente');
        const matchesRole = searchRole ? userRole === searchRole : true;
        return matchesEmail && matchesId && matchesRole;
    });

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Está seguro?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0d9488',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await deleteUser(id);
                cargarUsuarios(); // Recargar datos del hook
                Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
            } catch (err) {
                Swal.fire('Error', 'Hubo un error al eliminar el usuario.', 'error');
            }
        }
    };

    const handleCambiarRol = async (id, currentRole) => {
        const result = await Swal.fire({
            title: 'Modificar Rol',
            text: `¿Desea cambiar el rol actual (${currentRole})?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0d9488',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Sí, cambiar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await updateUserRole(id, currentRole);
                cargarUsuarios(); // Recargar datos del hook
                Swal.fire('¡Actualizado!', 'El rol fue modificado exitosamente.', 'success');
            } catch (err) {
                Swal.fire('Error', 'Hubo un error al actualizar el rol.', 'error');
            }
        }
    };

    if (loading) return <div className="tab-content fade-in"><p>Cargando usuarios...</p></div>;
    if (error) return <div className="tab-content fade-in"><p className="error">{error}</p></div>;

    return (
        <div className="tab-content fade-in">
            <header className="panel-header">
                <div>
                    <h1>Gestión de Usuarios</h1>
                    <p>Directorio de usuarios registrados. Se omiten datos sensibles (contraseñas).</p>
                </div>
                <div className="filtros-usuarios-container">
                    <div className="search-box">
                        <i className="icon-search">🔍</i>
                        <input 
                            type="text" 
                            placeholder="Buscar por correo electrónico..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="search-box">
                        <i className="icon-search">#️⃣</i>
                        <input 
                            type="number" 
                            placeholder="Buscar por ID..."
                            className="search-input"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                    </div>
                    <div className="search-box">
                        <i className="icon-search">👥</i>
                        <select 
                            className="search-input"
                            value={searchRole}
                            onChange={(e) => setSearchRole(e.target.value)}
                        >
                            <option value="">Todos los roles</option>
                            <option value="admin">Administrador (Admin)</option>
                            <option value="cliente">Cliente</option>
                        </select>
                    </div>
                </div>
            </header>
            
            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.length > 0 ? (
                            usuariosFiltrados.map(user => {
                                const userId = user.id || user.id_usuarios;
                                const userRole = user.role || (user.id_roles === 1 ? 'admin' : 'cliente');
                                return (
                                <tr key={userId}>
                                    <td>{userId}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge-role ${userRole}`}>
                                            {userRole}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn-action edit"
                                            onClick={() => handleCambiarRol(userId, userRole)}
                                            title="Cambiar Rol"
                                        >
                                            Cambiar Rol
                                        </button>
                                        <button 
                                            className="btn-action delete"
                                            onClick={() => handleEliminar(userId)}
                                            title="Eliminar"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" className="no-results">
                                    No se encontraron usuarios con ese correo.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination 
                paginaActual={page} 
                totalPaginas={totalPaginas} 
                onPageChange={setPage} 
            />
        </div>
    );
};

export default UsuariosPanel;
