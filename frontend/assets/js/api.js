/**
 * Flowzint AI - API Core Layer
 */
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const API = {
    /**
     * Standard fetch wrapper with auth header injection
     */
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('flowzint_access_token');
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            const data = await response.json();
            
            // Handle global 401 Unauthorized
            if (response.status === 401) {
                localStorage.removeItem('flowzint_access_token');
                window.location.href = 'login.html';
                throw new Error('Session expired');
            }

            if (!response.ok || data.status === 'error') {
                throw new Error(data.message || data.detail || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error(`[API Error] ${endpoint}:`, error);
            throw error;
        }
    },

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }
};

window.API = API;
