import { ENDPOINTS } from '../config/api';

const DEFAULT_SETTINGS = {
    hotelName: '',
    address: '',
    contact: {
        phone: '',
        email: '',
    },
    timezone: 'America/Costa_Rica',
    currency: 'USD',
    languages: ['es'],
    policies: {
        checkIn: '',
        checkOut: '',
        cancellation: '',
        pets: '',
        rules: '',
        requireAcceptance: false,
    },
    appearance: {
        primaryColor: '#0d9488',
        logo: '',
    },
};

const normalizeSettings = (payload) => {
    const rawSettings = Array.isArray(payload) ? payload[0] : payload;

    if (!rawSettings || typeof rawSettings !== 'object') {
        return { ...DEFAULT_SETTINGS };
    }

    return {
        ...DEFAULT_SETTINGS,
        ...rawSettings,
        contact: {
            ...DEFAULT_SETTINGS.contact,
            ...(rawSettings.contact || {}),
        },
        policies: {
            ...DEFAULT_SETTINGS.policies,
            ...(rawSettings.policies || {}),
        },
        appearance: {
            ...DEFAULT_SETTINGS.appearance,
            ...(rawSettings.appearance || {}),
        },
    };
};

const settingsService = {
    getSettings: async () => {
        try {
            const response = await fetch(ENDPOINTS.SETTINGS);
            if (!response.ok) throw new Error('Error al cargar la configuracion');
            const data = await response.json();
            return normalizeSettings(data);
        } catch (error) {
            console.error('Error in settingsService.getSettings:', error);
            throw error;
        }
    },

    updateSettings: async (settings) => {
        try {
            const normalizedSettings = normalizeSettings(settings);
            const settingsId = normalizedSettings.id;
            const targetUrl = settingsId
                ? `${ENDPOINTS.SETTINGS}/${settingsId}`
                : ENDPOINTS.SETTINGS;
            const method = settingsId ? 'PUT' : 'POST';

            const response = await fetch(targetUrl, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(normalizedSettings),
            });

            if (!response.ok) throw new Error('Error al actualizar la configuracion');

            const data = await response.json();
            return normalizeSettings(data);
        } catch (error) {
            console.error('Error in settingsService.updateSettings:', error);
            throw error;
        }
    }
};

export default settingsService;
