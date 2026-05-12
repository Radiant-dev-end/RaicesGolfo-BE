import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import settingsService from '../../../services/settingsService';
import { updateUserProfile } from '../../../services/CrudParaUsuarios';
import './ConfiguracionPanel.css';

const ConfiguracionPanel = () => {
    const [settings, setSettings] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeSubTab, setActiveSubTab] = useState('general');

    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
        password: '',
        photo: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const settingsData = await settingsService.getSettings();
                setSettings(settingsData);

                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    const user = JSON.parse(savedUser);
                    setCurrentUser(user);
                    setProfileForm({
                        name: user.name || '',
                        email: user.email || '',
                        password: user.password || '',
                        photo: user.photo || ''
                    });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setSettings(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: finalValue }
            }));
        } else {
            setSettings(prev => ({ ...prev, [name]: finalValue }));
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await settingsService.updateSettings(settings);
            Swal.fire({
                icon: 'success',
                title: '¡Guardado!',
                text: 'La configuración ha sido actualizada.',
                confirmButtonColor: '#0d9488'
            });
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar la configuración.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleProfileSave = async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        
        setSaving(true);
        try {
            const updated = await updateUserProfile(currentUser.id, profileForm);
            const newUser = { ...currentUser, ...updated };
            localStorage.setItem('user', JSON.stringify(newUser));
            setCurrentUser(newUser);
            Swal.fire({
                icon: 'success',
                title: '¡Perfil Actualizado!',
                text: 'Tu información de perfil ha sido guardada con éxito.',
                confirmButtonColor: '#0d9488'
            });
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el perfil.', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="tab-content"><p>Cargando...</p></div>;
    if (!settings) return <div className="tab-content"><p>Error al cargar la configuración.</p></div>;

    return (
        <div className="tab-content fade-in">
            <header className="panel-header">
                <div>
                    <h1>Configuración General</h1>
                    <p>Administre los datos básicos, políticas y su perfil de administrador.</p>
                </div>
            </header>

            <div className="config-container">
                <div className="config-tabs">
                    <button 
                        className={`config-tab-btn ${activeSubTab === 'general' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('general')}
                    >
                        Información General
                    </button>
                    <button 
                        className={`config-tab-btn ${activeSubTab === 'policies' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('policies')}
                    >
                        Políticas y Reglas
                    </button>
                    <button 
                        className={`config-tab-btn ${activeSubTab === 'appearance' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('appearance')}
                    >
                        Apariencia
                    </button>
                    <button 
                        className={`config-tab-btn ${activeSubTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveSubTab('profile')}
                    >
                        Mi Perfil
                    </button>
                </div>

                {activeSubTab !== 'profile' ? (
                    <form onSubmit={handleSave} className="config-form">
                        {activeSubTab === 'general' && (
                            <div className="form-section fade-in">
                                <div className="form-group">
                                    <label>Nombre del Hotel</label>
                                    <input type="text" name="hotelName" value={settings.hotelName} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Dirección</label>
                                    <input type="text" name="address" value={settings.address} onChange={handleChange} required />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Teléfono de Contacto</label>
                                        <input type="text" name="contact.phone" value={settings.contact.phone} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Email de Contacto</label>
                                        <input type="email" name="contact.email" value={settings.contact.email} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Moneda</label>
                                        <select name="currency" value={settings.currency} onChange={handleChange}>
                                            <option value="USD">USD - Dólar Estadounidense</option>
                                            <option value="CRC">CRC - Colón Costarricense</option>
                                            <option value="EUR">EUR - Euro</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Zona Horaria</label>
                                        <input type="text" name="timezone" value={settings.timezone} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSubTab === 'policies' && (
                            <div className="form-section fade-in">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Check-In (Formato 24h)</label>
                                        <input type="time" name="policies.checkIn" value={settings.policies.checkIn} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Check-Out (Formato 24h)</label>
                                        <input type="time" name="policies.checkOut" value={settings.policies.checkOut} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Política de Cancelación</label>
                                    <textarea name="policies.cancellation" value={settings.policies.cancellation} onChange={handleChange} rows="3" />
                                </div>
                                <div className="form-group">
                                    <label>Política de Mascotas</label>
                                    <textarea name="policies.pets" value={settings.policies.pets} onChange={handleChange} rows="2" />
                                </div>
                                <div className="form-group">
                                    <label>Reglas del Hotel</label>
                                    <textarea name="policies.rules" value={settings.policies.rules || ''} onChange={handleChange} rows="4" placeholder="Ej: No fumar, Silencio a las 10 PM..." />
                                </div>
                                <div className="form-group checkbox-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                        <input 
                                            type="checkbox" 
                                            name="policies.requireAcceptance" 
                                            checked={settings.policies.requireAcceptance || false} 
                                            onChange={handleChange} 
                                            style={{ width: 'auto' }}
                                        />
                                        <span>Requerir aceptación de políticas al reservar</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {activeSubTab === 'appearance' && (
                            <div className="form-section fade-in">
                                <div className="form-group">
                                    <label>Color Primario</label>
                                    <div className="color-picker-container">
                                        <input type="color" name="appearance.primaryColor" value={settings.appearance.primaryColor} onChange={handleChange} />
                                        <span>{settings.appearance.primaryColor}</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Logo URL</label>
                                    <input type="text" name="appearance.logo" value={settings.appearance.logo} onChange={handleChange} />
                                    {settings.appearance.logo && (
                                        <div className="logo-preview">
                                            <img src={settings.appearance.logo} alt="Logo preview" style={{ maxHeight: '100px', marginTop: '10px' }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="form-actions">
                            <button type="submit" className="btn-save" disabled={saving}>
                                {saving ? 'Guardando...' : 'Guardar Configuración'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleProfileSave} className="config-form">
                        <div className="form-section fade-in">
                            <div className="profile-header-edit">
                                {profileForm.photo ? (
                                    <img src={profileForm.photo} alt="Profile" className="profile-preview-img" />
                                ) : (
                                    <div className="profile-preview-placeholder">{profileForm.name?.charAt(0) || 'A'}</div>
                                )}
                                <div>
                                    <h3>{profileForm.name || 'Administrador'}</h3>
                                    <p>{currentUser?.role || 'Admin User'}</p>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <input type="text" name="name" value={profileForm.name} onChange={handleProfileChange} required />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" value={profileForm.email} onChange={handleProfileChange} required />
                            </div>
                            <div className="form-group">
                                <label>Contraseña</label>
                                <input type="password" name="password" value={profileForm.password} onChange={handleProfileChange} required />
                            </div>
                            <div className="form-group">
                                <label>URL de Foto de Perfil</label>
                                <input type="text" name="photo" value={profileForm.photo} onChange={handleProfileChange} placeholder="https://ejemplo.com/foto.jpg" />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-save" disabled={saving}>
                                {saving ? 'Guardando...' : 'Actualizar Perfil'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ConfiguracionPanel;
