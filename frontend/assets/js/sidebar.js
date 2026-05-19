/**
 * Flowzint AI - Sidebar Component
 */

class Sidebar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="sidebar-brand">
                <div class="brand-icon"><i class="fa-solid fa-robot"></i></div>
                <span class="heading-md">Flowzint</span>
            </div>

            <div class="sidebar-scroll">
                <div class="nav-section">
                    <div class="nav-label">Overview</div>
                    <a href="#" class="nav-item active">
                        <i class="fa-solid fa-border-all"></i>
                        <span>Command Center</span>
                    </a>
                    <a href="#" class="nav-item">
                        <i class="fa-solid fa-brain"></i>
                        <span>Intelligence Center</span>
                    </a>
                    <a href="#" class="nav-item">
                        <i class="fa-solid fa-microchip"></i>
                        <span>AI Operating System</span>
                    </a>
                </div>

                <div class="nav-section">
                    <div class="nav-label">Agents & Actions</div>
                    <a href="#" class="nav-item">
                        <i class="fa-solid fa-pen-nib"></i>
                        <span>Script Agent</span>
                    </a>
                    <a href="#" class="nav-item">
                        <i class="fa-solid fa-envelope-open-text"></i>
                        <span>Gmail Agent</span>
                    </a>
                    <a href="#" class="nav-item">
                        <i class="fa-solid fa-calendar-check"></i>
                        <span>Booking Agent</span>
                    </a>
                </div>
                
                <div class="nav-section">
                    <div class="nav-label">System</div>
                    <a href="#" class="nav-item">
                        <i class="fa-solid fa-gear"></i>
                        <span>Settings</span>
                    </a>
                    <a href="#" class="nav-item" id="nav-logout-btn" style="cursor: pointer;">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                        <span>Logout</span>
                    </a>
                </div>
            </div>

            <div class="sidebar-footer">
                <div class="user-card">
                    <img src="https://ui-avatars.com/api/?name=Creator&background=8b5cf6&color=fff" alt="User">
                    <div class="user-info">
                        <div style="font-weight: 600; font-size: 0.85rem;" id="user-email">Creator Pro</div>
                        <div style="font-size: 0.75rem; color: var(--primary-light);">Pro Plan</div>
                    </div>
                </div>
            </div>
        `;

        // Bind logout dynamically
        setTimeout(() => {
            const logoutBtn = document.getElementById('nav-logout-btn');
            if (logoutBtn && typeof Auth !== 'undefined') {
                logoutBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    await Auth.logout();
                });
            }
        }, 100);
    }
}

window.Sidebar = Sidebar;
