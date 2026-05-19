/**
 * Flowzint AI - Layout Interactivity & Chatbot
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Resolve User Identity
    const userEmailEl = document.getElementById('user-email');
    if (userEmailEl && typeof Auth !== 'undefined') {
        try {
            const user = await Auth.getCurrentUser();
            if (user) {
                const namePart = user.email.split('@')[0];
                userEmailEl.innerHTML = `${namePart} <i class="fa-solid fa-circle-check" style="color: var(--primary); font-size: 0.75rem;"></i>`;
            }
        } catch (e) {
            console.error("Auth check failed:", e);
        }
    }

    // 2. Disconnect Handler
    const userMenuBtn = document.getElementById('user-menu-btn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', async () => {
            if (confirm("Disconnect from session?")) {
                await Auth.logout();
            }
        });
    }

    // 3. Chatbot Interaction Logic
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotPopup = document.getElementById('chatbot-popup');
    const chatbotClose = document.getElementById('chatbot-close');

    if (chatbotToggle && chatbotPopup && chatbotClose) {
        chatbotToggle.addEventListener('click', () => {
            chatbotPopup.style.display = 'flex';
            chatbotToggle.style.display = 'none'; // Hide the circle when open
        });

        chatbotClose.addEventListener('click', () => {
            chatbotPopup.style.display = 'none';
            chatbotToggle.style.display = 'flex'; // Show circle again
        });
    }
});
