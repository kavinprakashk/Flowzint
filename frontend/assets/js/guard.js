/**
 * Flowzint AI - Route Guard Middleware
 * Include this script synchronously in the <head> of protected or auth pages.
 */

(function() {
    const token = localStorage.getItem('flowzint_access_token');
    const path = window.location.pathname;
    const isAuthPage = path.endsWith('login.html') || path.endsWith('register.html') || path === '/' || path.endsWith('index.html');
    const isProtectedPage = path.endsWith('dashboard.html');

    if (isProtectedPage && !token) {
        // Prevent flashing of protected content
        document.documentElement.style.display = 'none';
        window.location.replace('login.html');
    }

    if (isAuthPage && token) {
        // Prevent rendering auth page if already logged in
        document.documentElement.style.display = 'none';
        window.location.replace('dashboard.html');
    }
})();
