const API_URL = 'http://localhost:3007/users';

export const getUsers = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al obtener los usuarios');
        return await response.json();
    } catch (error) {
        console.error("Error getUsers:", error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar el usuario');
        return await response.json();
    } catch (error) {
        console.error("Error deleteUser:", error);
        throw error;
    }
};

export const updateUserRole = async (id, currentRole) => {
    try {
        const newRole = currentRole === 'admin' ? 'cliente' : 'admin';
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: newRole })
        });
        if (!response.ok) throw new Error('Error al actualizar el rol');
        return await response.json();
    } catch (error) {
        console.error("Error updateUserRole:", error);
        throw error;
    }
};
export const updateUserProfile = async (id, userData) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Error al actualizar el perfil');
        return await response.json();
    } catch (error) {
        console.error("Error updateUserProfile:", error);
        throw error;
    }
};
