/**
 * Flowzint AI - Navbar Component
 */

class Navbar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="search-bar">
                <i class="fa-solid fa-search"></i>
                <input type="text" placeholder="Search insights, agents, keywords... (⌘K)">
            </div>

            <div class="topbar-actions">
                <div class="status-indicator" style="display: flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--success); background: rgba(16, 185, 129, 0.1); padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.2);">
                    <div style="width: 6px; height: 6px; background: var(--success); border-radius: 50%; box-shadow: 0 0 8px var(--success);"></div>
                    System Online
                </div>
                <div class="icon-btn">
                    <i class="fa-regular fa-bell"></i>
                    <div class="notification-dot"></div>
                </div>
                <button class="btn btn-primary" style="margin-left: 8px;">
                    <i class="fa-solid fa-plus"></i> New Campaign
                </button>
            </div>
        `;
    }
}

window.Navbar = Navbar;
