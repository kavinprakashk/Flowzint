/* audience-insights.js - Flowzint Creator OS Audience Insights Script */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Tab Switching Animation
    const tabs = document.querySelectorAll('.tab-nav-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            tabs.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            console.log(`Switched Audience Insights Tab: ${this.textContent.trim()}`);
        });
    });

    // 2. Export report simulator
    const exportBtn = document.querySelector('.btn-export-audience-report');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
            setTimeout(() => {
                exportBtn.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Report Downloaded';
                alert('Audience Demographics & Retention Intelligence PDF successfully compiled and downloaded!');
                setTimeout(() => {
                    exportBtn.innerHTML = '<i class="fa-solid fa-arrow-up-from-bracket"></i> Export Report';
                }, 2000);
            }, 1200);
        });
    }

    // 3. Datepicker simulated toggle
    const datePicker = document.querySelector('.date-picker');
    if (datePicker) {
        datePicker.style.cursor = 'pointer';
        datePicker.addEventListener('click', () => {
            alert('Date Range Picker: Select custom intervals for audience monitoring.');
        });
    }

    // 4. Device cards interactive selection
    const deviceCards = document.querySelectorAll('.device-card');
    deviceCards.forEach(card => {
        card.addEventListener('click', function() {
            deviceCards.forEach(c => {
                c.style.borderColor = '';
                c.style.background = '';
                c.style.boxShadow = '';
            });
            
            this.style.borderColor = 'var(--primary)';
            this.style.background = 'rgba(99, 56, 240, 0.02)';
            this.style.boxShadow = '0 0 10px rgba(99, 56, 240, 0.1)';
        });
    });

    // 5. Interest chips simulated filtering
    const chips = document.querySelectorAll('.interest-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // 6. Chatbot popup toggles
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
