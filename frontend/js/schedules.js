/* schedules.js - Flowzint Creator OS Schedules Dashboard Controller */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Tab Navigation switching
    const tabItems = document.querySelectorAll('.schedules-tab-item');
    tabItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            tabItems.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            console.log(`Active Schedules Tab: ${this.textContent.trim()}`);
        });
    });

    // 2. Action Buttons Trigger Alerts
    const actionIcons = document.querySelectorAll('.actions-cell i');
    actionIcons.forEach(icon => {
        icon.style.cursor = 'pointer';
        icon.addEventListener('click', function() {
            let rowTitle = this.closest('tr').querySelector('.content-title').textContent.trim();
            if (this.classList.contains('fa-pen')) {
                alert(`Edit scheduled post: "${rowTitle}"`);
            } else if (this.classList.contains('fa-copy') || this.classList.contains('fa-clone') || this.classList.contains('fa-paperclip')) {
                alert(`Duplicate scheduled post: "${rowTitle}"`);
            } else {
                alert(`Action menu for scheduled post: "${rowTitle}"`);
            }
        });
    });

    // 3. Quick Action items click glow
    const quickActions = document.querySelectorAll('.quick-action-item');
    quickActions.forEach(action => {
        action.addEventListener('click', function() {
            let actionTitle = this.querySelector('.quick-action-title').textContent.trim();
            alert(`Triggering Creator Action: ${actionTitle}`);
        });
    });

    // 4. View Full Calendar simulated load
    const fullCalendarBtn = document.querySelector('.btn-view-full-calendar');
    if (fullCalendarBtn) {
        fullCalendarBtn.addEventListener('click', () => {
            fullCalendarBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Fetching Full Calendar...';
            setTimeout(() => {
                fullCalendarBtn.innerHTML = '<i class="fa-regular fa-calendar-days"></i> Synced to Calendar';
                alert('Detailed monthly publishing schedules fetched and synced to Google Calendar!');
                setTimeout(() => {
                    fullCalendarBtn.innerHTML = 'View Full Calendar <i class="fa-solid fa-arrow-right"></i>';
                }, 2000);
            }, 1200);
        });
    }

    // 5. Floating Chatbot popup integrations
    const chatbotToggle = document.getElementById('schedules-chatbot-trigger');
    const chatbotPopup = document.getElementById('chatbot-popup');
    const chatbotClose = document.getElementById('chatbot-close');

    if (chatbotToggle && chatbotPopup) {
        chatbotToggle.addEventListener('click', () => {
            chatbotPopup.classList.toggle('active');
        });
    }

    if (chatbotClose && chatbotPopup) {
        chatbotClose.addEventListener('click', () => {
            chatbotPopup.classList.remove('active');
        });
    }
});
