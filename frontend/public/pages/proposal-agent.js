// flowzint - Standalone Proposal Agent Controller (PUBLIC PAGES VERSION)
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial entrance animations with GSAP
    animateEntrance();

    // 2. Tab Navigation logic
    initTabs();

    // 3. Platform Focus button selections
    initPlatformFocus();

    // 4. Input Character Counters
    initCharacterCounters();

    // 5. Intelligent Pitch Generator & Clear System
    initGeneratorEngine();

    // 6. Floating Assistant Agent Chatbox
    initAssistantChatbot();
});

function animateEntrance() {
    // Sidebar slide-in
    gsap.from('.sidebar', {
        x: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Top Header slide-down
    gsap.from('.top-header', {
        y: -40,
        opacity: 0,
        duration: 0.8,
        delay: 0.1,
        ease: 'power3.out'
    });

    // Page Hero Header
    gsap.from('.agent-hero-header', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        delay: 0.2,
        ease: 'power3.out'
    });

    // Tabs container
    gsap.from('.nav-tabs-container', {
        y: 10,
        opacity: 0,
        duration: 0.7,
        delay: 0.3,
        ease: 'power3.out'
    });

    // 3-Column main elements
    gsap.from('.left-column', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: 'power4.out'
    });

    gsap.from('.center-column', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: 'power4.out'
    });

    gsap.from('.right-column > *', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // Bottom strip
    gsap.from('.bottom-features-strip', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.8,
        ease: 'power3.out'
    });
}

function initTabs() {
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // GSAP microinteraction click bounce
            gsap.fromTo(tab, { scale: 0.96 }, { scale: 1, duration: 0.2 });
        });
    });
}

function initPlatformFocus() {
    const btns = document.querySelectorAll('.platform-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function initCharacterCounters() {
    const textareas = document.querySelectorAll('.form-textarea');
    const inputs = document.querySelectorAll('.form-input');

    const setupCounter = (element, maxLength) => {
        const counterSpan = element.closest('.form-group').querySelector('.char-counter');
        if (!counterSpan) return;

        element.addEventListener('input', () => {
            const length = element.value.length;
            counterSpan.textContent = `${length}/${maxLength}`;
            
            if (length >= maxLength) {
                counterSpan.style.color = '#ef4444';
            } else {
                counterSpan.style.color = 'var(--text-light)';
            }
        });
    };

    // Setup for typical fields matching reference index limits
    inputs.forEach(input => {
        if (input.placeholder.includes('YouTube Integration')) {
            setupCounter(input, 100);
        } else if (input.placeholder.includes('Deliverables')) {
            setupCounter(input, 200);
        }
    });

    textareas.forEach(textarea => {
        setupCounter(textarea, 300);
    });
}

function initGeneratorEngine() {
    const generateBtn = document.querySelector('.generate-proposal-btn');
    const clearBtn = document.querySelector('.clear-all-btn');
    const previewContent = document.querySelector('.preview-content-box');
    
    if (!generateBtn || !clearBtn || !previewContent) return;
    
    const originalEmptyStateHtml = previewContent.innerHTML;

    generateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Dynamic fetch of values
        const brandName = document.querySelector('input[placeholder="e.g. Nike, Google, Notion"]').value || 'Nike';
        const contactPerson = document.querySelector('input[placeholder="e.g. Sarah Johnson"]').value || 'Sarah';
        const campaignTitle = document.querySelector('input[placeholder="e.g. YouTube Integration Campaign"]').value || 'YouTube Integration Campaign';
        const budget = document.querySelector('input[placeholder="e.g. $1,000 – $5,000"]').value || '$4,500';
        
        const deliverablesInput = document.querySelector('.deliverables-group input');
        const deliverables = deliverablesInput ? deliverablesInput.value : '1 Dedicated Video Sponsorship';
        
        const textareas = document.querySelectorAll('.form-textarea');
        const messagePoints = (textareas[0] && textareas[0].value) ? textareas[0].value : 'Integrating seamless brand alignment, high retention rate, and a direct visual review.';

        // 1. Trigger micro spinner loader
        previewContent.innerHTML = `
            <div class="loader-container" style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:100%;">
                <div class="spinner-sparkle" style="position:relative; width:50px; height:50px; margin-bottom:14px; display:flex; align-items:center; justify-content:center;">
                    <i data-lucide="sparkles" class="spinning-icon" style="width:36px; height:36px; color:var(--accent-purple); animation: spin 2.5s linear infinite;"></i>
                </div>
                <h4 style="font-size:0.85rem; font-weight:800; color:var(--text-main); margin-bottom:2px;">Drafting Proposal...</h4>
                <p style="font-size:0.7rem; color:var(--text-light); font-weight:500;">Applying Flowzint AI models</p>
            </div>
        `;
        lucide.createIcons();

        // 2. Reveal tailored proposal content after delay
        setTimeout(() => {
            previewContent.innerHTML = `
                <div class="generated-proposal-container" style="width:100%; height:100%; text-align:left; overflow-y:auto; padding:5px; animation: fadeIn 0.4s ease-out;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
                        <h4 style="font-size:0.9rem; font-weight:800; color:var(--accent-purple);">${campaignTitle}</h4>
                        <span style="font-size:0.65rem; color:var(--text-muted); font-weight:700;">Live Draft • v1.0</span>
                    </div>
                    <div style="font-size:0.78rem; color:var(--text-main); line-height:1.55; display:flex; flex-direction:column; gap:10px;">
                        <p><strong>Hi ${contactPerson},</strong></p>
                        
                        <p>I hope this message finds you well! I'm reaching out to pitch a highly targeted collaboration partnership with <strong>${brandName}</strong>. Based on my channel analytics, my audience perfectly fits your target profile.</p>
                        
                        <div style="background-color:var(--accent-purple-light); border-left:3px solid var(--accent-purple); padding:8px 12px; border-radius:6px; margin:4px 0;">
                            <strong style="color:var(--accent-purple);">Proposed Deliverables:</strong><br>
                            • ${deliverables}<br>
                            • Platform-wide audience amplification
                        </div>

                        <p><strong>Core Concept:</strong> ${messagePoints}</p>
                        
                        <p>My goal is to deliver authentic integration slots that provide organic, high-converting clicks directly to your landing pages.</p>
                        
                        <div style="display:flex; justify-content:space-between; font-size:0.72rem; font-weight:700; color:var(--text-muted); border-top:1px solid var(--border-color); padding-top:10px; margin-top:8px;">
                            <span>Proposed Budget: ${budget}</span>
                            <span>Timeline: 2-3 Weeks</span>
                        </div>
                    </div>
                </div>
            `;
            gsap.from('.generated-proposal-container', { scale: 0.97, opacity: 0, duration: 0.35, ease: 'back.out(1.2)' });
        }, 1400);
    });

    clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Reset all inputs & counters
        document.querySelectorAll('.form-input, .form-textarea').forEach(el => el.value = '');
        document.querySelectorAll('.form-select').forEach(el => el.selectedIndex = 0);
        document.querySelectorAll('.char-counter').forEach(el => {
            const limit = el.textContent.split('/')[1];
            el.textContent = `0/${limit}`;
            el.style.color = 'var(--text-light)';
        });
        
        // Restore empty state
        previewContent.innerHTML = originalEmptyStateHtml;
        lucide.createIcons();
    });
}

function initAssistantChatbot() {
    const trigger = document.querySelector('.floating-chatbot-trigger');
    if (!trigger) return;
    
    // Create actual Chatbox floating container
    const chatbox = document.createElement('div');
    chatbox.className = 'glass-chatbox-container';
    chatbox.style = `
        position: fixed;
        bottom: 96px;
        right: 30px;
        width: 340px;
        height: 440px;
        background: #ffffff;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-xl);
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        display: none;
        flex-direction: column;
        z-index: 999;
        overflow: hidden;
        font-family: var(--font-primary);
    `;
    
    chatbox.innerHTML = `
        <div style="background: var(--accent-purple-gradient); padding:16px; color:#ffffff; display:flex; align-items:center; justify-content:space-between;">
            <div style="display:flex; align-items:center; gap:10px;">
                <i data-lucide="bot" style="width:20px; height:20px;"></i>
                <div>
                    <h4 style="font-size:0.85rem; font-weight:800; margin:0;">Assistant Agent</h4>
                    <span style="font-size:0.65rem; opacity:0.8;">Online & Ready</span>
                </div>
            </div>
            <i data-lucide="x" class="close-chat" style="width:18px; height:18px; cursor:pointer; opacity:0.8;"></i>
        </div>
        <div class="chat-messages-box" style="flex:1; padding:16px; overflow-y:auto; font-size:0.8rem; display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; gap:8px;">
                <div style="width:28px; height:28px; border-radius:50%; background:var(--accent-purple-light); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                    <i data-lucide="bot" style="width:14px; height:14px; color:var(--accent-purple);"></i>
                </div>
                <div style="background:#f1f5f9; padding:10px; border-radius:12px; max-width:80%; line-height:1.4;">
                    Hi! I'm your flowzint operating assistant. How can I help you optimize your proposal today?
                </div>
            </div>
        </div>
        <div style="padding:12px; border-top:1px solid var(--border-color); display:flex; gap:8px; background:#f8fafc;">
            <input type="text" class="chat-input" placeholder="Type a message..." style="flex:1; border:1px solid var(--border-color); border-radius:20px; padding:6px 14px; font-size:0.8rem; outline:none; background:#ffffff;">
            <button class="chat-send-btn" style="background:var(--accent-purple-gradient); border:none; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#ffffff;">
                <i data-lucide="send" style="width:14px; height:14px;"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(chatbox);
    lucide.createIcons();

    // Trigger toggle chatbox
    trigger.addEventListener('click', () => {
        const isVisible = chatbox.style.display === 'flex';
        if (isVisible) {
            gsap.to(chatbox, { scale: 0.95, opacity: 0, duration: 0.2, onComplete: () => chatbox.style.display = 'none' });
        } else {
            chatbox.style.display = 'flex';
            gsap.fromTo(chatbox, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
        }
    });

    // Close chatbox
    chatbox.querySelector('.close-chat').addEventListener('click', () => {
        gsap.to(chatbox, { scale: 0.95, opacity: 0, duration: 0.2, onComplete: () => chatbox.style.display = 'none' });
    });

    // Send Message
    const chatInput = chatbox.querySelector('.chat-input');
    const sendBtn = chatbox.querySelector('.chat-send-btn');
    const msgBox = chatbox.querySelector('.chat-messages-box');

    const sendMessage = () => {
        const text = chatInput.value.trim();
        if (!text) return;

        // User message bubble
        const userBubble = document.createElement('div');
        userBubble.style = 'display:flex; gap:8px; justify-content:flex-end;';
        userBubble.innerHTML = `
            <div style="background:var(--accent-purple-gradient); color:#ffffff; padding:10px; border-radius:12px; max-width:80%; line-height:1.4;">
                ${text}
            </div>
        `;
        msgBox.appendChild(userBubble);
        chatInput.value = '';
        msgBox.scrollTop = msgBox.scrollHeight;

        // Trigger typing simulation
        setTimeout(() => {
            const agentBubble = document.createElement('div');
            agentBubble.style = 'display:flex; gap:8px;';
            agentBubble.innerHTML = `
                <div style="width:28px; height:28px; border-radius:50%; background:var(--accent-purple-light); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                    <i data-lucide="bot" style="width:14px; height:14px; color:var(--accent-purple);"></i>
                </div>
                <div style="background:#f1f5f9; padding:10px; border-radius:12px; max-width:80%; line-height:1.4;">
                    Got it! Creating an ideal sponsorship pitch for Nike requires focus on specific deliverables and direct CTR impact. I've logged this to your campaign insights.
                </div>
            `;
            msgBox.appendChild(agentBubble);
            lucide.createIcons();
            msgBox.scrollTop = msgBox.scrollHeight;
        }, 1000);
    };

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}
