/* competitors.js - Flowzint Creator OS Competitor Interactive Script */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Tab switching animation simulation
    const tabs = document.querySelectorAll('.tab-nav-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            tabs.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            // Console status check
            console.log(`Switched Competitors Tab: ${this.textContent.trim()}`);
        });
    });

    // 2. Export button action simulation
    const exportBtn = document.querySelector('.btn-export-report');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
            setTimeout(() => {
                exportBtn.innerHTML = '<i class="fa-solid fa-file-pdf"></i> PDF Downloaded';
                alert('Competitor Intelligence Report successfully compiled and downloaded as PDF!');
                setTimeout(() => {
                    exportBtn.innerHTML = '<i class="fa-solid fa-arrow-up-from-bracket"></i> Export Report';
                }, 2000);
            }, 1400);
        });
    }

    // 3. Datepicker Simulated Toggle
    const datePicker = document.querySelector('.date-picker');
    if (datePicker) {
        datePicker.style.cursor = 'pointer';
        datePicker.addEventListener('click', () => {
            alert('Date Range Picker: Select custom intervals for competitor monitoring.');
        });
    }

    // 4. Opportunity Insights Click Glow
    const opportunityCards = document.querySelectorAll('.opportunity-card');
    opportunityCards.forEach(card => {
        card.addEventListener('click', function() {
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

    // 5. Chatbot Popup controls
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
