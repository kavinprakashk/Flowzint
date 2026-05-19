// Main Application Initialization
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initDashboardCharts();
    
    // Initial GSAP entrance animation
    gsap.from('.sidebar', { x: -50, opacity: 0, duration: 0.8, ease: "power3.out" });
    gsap.from('.top-bar', { y: -30, opacity: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
    gsap.from('.widget', { y: 30, opacity: 0, duration: 0.8, delay: 0.4, stagger: 0.1, ease: "power3.out" });
});

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            // Add to clicked
            item.classList.add('active');
            
            // Logic to switch views will go here (Routing)
            const route = item.getAttribute('data-route');
            console.log(`Navigating to: ${route}`);
            // Note: Full routing system to be implemented later.
        });
    });
}

function initDashboardCharts() {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Views (Simulated)',
                data: [1200, 1900, 1500, 2200, 1800, 3100, 2800],
                borderColor: '#00E5FF',
                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#A0A0B0' }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#A0A0B0' }
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#A0A0B0' }
                }
            }
        }
    });
}
