/* content-performance.js - Flowzint Creator OS Content Performance Interactive Script */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Route Active Class Toggle Check
    const sidebarItems = document.querySelectorAll('.nav-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // If it's a real anchor redirection, let it happen naturally
            if (this.getAttribute('href') && this.getAttribute('href') !== '#') {
                return;
            }
            e.preventDefault();
            sidebarItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 2. Datepicker Dropdown Interaction Simulation
    const datePicker = document.querySelector('.date-picker');
    if (datePicker) {
        datePicker.style.cursor = 'pointer';
        datePicker.addEventListener('click', () => {
            alert('Date Range Picker: Select Custom Campaign Intervals (Simulated Integration)');
        });
    }

    // 3. Export Data Simulation
    const exportBtn = document.querySelector('.btn-export');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Exporting...';
            setTimeout(() => {
                exportBtn.innerHTML = '<i class="fa-solid fa-file-export"></i> Exported CSV';
                alert('Campaign CSV successfully generated and downloaded!');
                setTimeout(() => {
                    exportBtn.innerHTML = '<i class="fa-solid fa-arrow-up-from-bracket"></i> Export';
                }, 2000);
            }, 1200);
        });
    }

    // 4. Content Preference Card Click Glow
    const prefCards = document.querySelectorAll('.pref-card');
    prefCards.forEach(card => {
        card.addEventListener('click', function() {
            // Visual feedback glow
            this.style.transform = 'scale(0.97)';
            this.style.borderColor = 'var(--primary)';
            this.style.boxShadow = '0 0 10px rgba(99, 56, 240, 0.15)';
            
            setTimeout(() => {
                this.style.transform = '';
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }, 300);
        });
    });

    // 5. Chatbot Widget Interactive Popups
    const chatbotToggle = document.getElementById('chatbot-toggle');
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
