/**
 * Flowzint AI - Authentication State Management
 * Depends on: api.js
 */

const Auth = {
    async login(email, password) {
        const response = await API.post('/auth/login', { email, password });
        if (response.data && response.data.access_token) {
            localStorage.setItem('flowzint_access_token', response.data.access_token);
        }
        return response;
    },

    async register(email, password) {
        return await API.post('/auth/signup', { email, password });
    },

    async logout() {
        try {
            await API.post('/auth/logout', {});
        } catch (e) {
            console.warn("Server logout failed, clearing local session anyway.");
        } finally {
            localStorage.removeItem('flowzint_access_token');
            window.location.href = 'login.html';
        }
    },

    async getCurrentUser() {
        if (!this.isAuthenticated()) return null;
        try {
            const response = await API.get('/auth/me');
            return response.data;
        } catch (e) {
            return null;
        }
    },

    isAuthenticated() {
        return !!localStorage.getItem('flowzint_access_token');
    }
};

window.Auth = Auth;
