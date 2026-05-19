/**
 * Flowzint AI - Navbar Component
 * Dynamically injects the topbar into the DOM.
 */

class Navbar {
    constructor(containerId, title = 'System Overview') {
        this.container = document.getElementById(containerId);
        this.title = title;
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="topbar-title">${this.title}</div>
            <div class="topbar-actions">
                <div class="status-indicator">
                    <div class="status-dot" id="api-status"></div>
                    <span id="api-status-text">Connecting...</span>
                </div>
            </div>
        `;
    }
}

window.Navbar = Navbar;
