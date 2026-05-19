/* booking-agent.js */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Booking Agent Initialized.");

    // Simple tab switching logic
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });
});
