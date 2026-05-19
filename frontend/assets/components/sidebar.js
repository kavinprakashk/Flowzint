/**
 * Flowzint AI - Sidebar Component
 * Dynamically injects the sidebar into the DOM.
 */

class Sidebar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    render() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="sidebar-header">
                <i class="fa-solid fa-network-wired text-gradient"></i>
                <span class="sidebar-brand text-gradient">Flowzint AI</span>
            </div>
            
            <nav class="sidebar-nav">
                <a href="#" class="nav-item active">
                    <i class="fa-solid fa-chart-pie"></i>
                    <span>Neural Dashboard</span>
                </a>
                <a href="#" class="nav-item">
                    <i class="fa-solid fa-robot"></i>
                    <span>Agent Swarm</span>
                </a>
                <a href="#" class="nav-item">
                    <i class="fa-brands fa-youtube"></i>
                    <span>YouTube Engine</span>
                </a>
                <a href="#" class="nav-item">
                    <i class="fa-solid fa-envelope-open-text"></i>
                    <span>Gmail Parser</span>
                </a>
                <a href="#" class="nav-item">
                    <i class="fa-solid fa-project-diagram"></i>
                    <span>Workflows</span>
                </a>
            </nav>

            <div class="sidebar-footer">
                <div class="user-profile">
                    <div class="avatar"><i class="fa-solid fa-user-astronaut"></i></div>
                    <div class="user-info">
                        <span class="user-email" id="user-email">Loading...</span>
                        <span class="user-role glow-text" id="user-role">OPERATOR</span>
                    </div>
                </div>
                <button class="btn-secondary" id="logout-btn" style="width: 100%; margin-top: 16px; padding: 10px; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fa-solid fa-power-off"></i> Disconnect
                </button>
            </div>
        `;
    }
}

window.Sidebar = Sidebar;
