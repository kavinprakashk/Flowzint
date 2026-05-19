/* analytics.js */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Chart Tabs Interactivity
    const tabButtons = document.querySelectorAll('.chart-tab-btn');
    const chartPath = document.querySelector('.chart-line-path');
    const areaPath = document.querySelector('.chart-area-path');
    const tooltipValue = document.querySelector('.chart-tooltip-value');
    
    // SVG mock path data for different metrics
    const pathData = {
        views: {
            line: "M0,220 Q150,140 300,180 T600,60 T900,110 T1200,40",
            area: "M0,220 Q150,140 300,180 T600,60 T900,110 T1200,40 L1200,280 L0,280 Z",
            tooltip: "142.8K Views"
        },
        watchtime: {
            line: "M0,240 Q150,190 300,130 T600,160 T900,80 T1200,60",
            area: "M0,240 Q150,190 300,130 T600,160 T900,80 T1200,60 L1200,280 L0,280 Z",
            tooltip: "5.2K Hours"
        },
        subscribers: {
            line: "M0,200 Q150,110 300,150 T600,80 T900,90 T1200,30",
            area: "M0,200 Q150,110 300,150 T600,80 T900,90 T1200,30 L1200,280 L0,280 Z",
            tooltip: "+1,240 Subs"
        },
        engagement: {
            line: "M0,180 Q150,170 300,140 T600,110 T900,60 T1200,50",
            area: "M0,180 Q150,170 300,140 T600,110 T900,60 T1200,50 L1200,280 L0,280 Z",
            tooltip: "8.45% Rate"
        }
    };

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active visual states
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Get selected metric data
            const metric = btn.getAttribute('data-metric');
            const data = pathData[metric];
            
            if (data) {
                // Animate/Transition SVG chart paths
                chartPath.setAttribute('d', data.line);
                areaPath.setAttribute('d', data.area);
                if (tooltipValue) {
                    tooltipValue.textContent = data.tooltip;
                }
            }
        });
    });

    // 2. SVG Main Chart Hover Tooltip Positioning
    const chartWrapper = document.querySelector('.svg-chart-container');
    const tooltip = document.querySelector('.chart-tooltip');
    
    if (chartWrapper && tooltip) {
        chartWrapper.addEventListener('mousemove', (e) => {
            const rect = chartWrapper.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            
            // Constrain tooltip boundary limits
            const constrainedX = Math.max(100, Math.min(rect.width - 100, mouseX));
            
            // Position tooltip dynamically horizontally
            tooltip.style.left = `${constrainedX}px`;
        });
    }

    // 3. Right Sidebar - AI Recommendations Actions
    const recommendationItems = document.querySelectorAll('.insight-alert-item');
    recommendationItems.forEach(item => {
        item.addEventListener('click', () => {
            item.style.transform = 'scale(0.98)';
            setTimeout(() => {
                item.style.transform = 'none';
            }, 150);
        });
    });

    // 4. Floating Chatbot Toggle Logic (Static Widget UI)
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotPopup = document.getElementById('chatbot-popup');
    const chatbotClose = document.getElementById('chatbot-close');

    if (chatbotToggle && chatbotPopup) {
        chatbotToggle.addEventListener('click', () => {
            chatbotPopup.style.display = (chatbotPopup.style.display === 'flex') ? 'none' : 'flex';
        });
    }

    if (chatbotClose && chatbotPopup) {
        chatbotClose.addEventListener('click', (e) => {
            e.stopPropagation();
            chatbotPopup.style.display = 'none';
        });
    }
});
