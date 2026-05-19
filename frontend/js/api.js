// API Wrapper Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:8000/api/v1',
    HEADERS: {
        'Content-Type': 'application/json'
    }
};

/**
 * Generic API Fetch wrapper
 */
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...API_CONFIG.HEADERS,
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Call Failed:', error);
        throw error;
    }
}

// Example specific modules
const YoutubeAPI = {
    getChannels: () => apiCall('/youtube/channels')
};

const InboxAPI = {
    // Hooks for the existing module
    getEmails: () => apiCall('/inbox/emails')
};
