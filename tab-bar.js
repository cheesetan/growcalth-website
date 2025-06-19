// Tab Bar Component
class TabBar {
    constructor(containerId = 'tab-bar-container') {
        this.containerId = containerId;
        this.tabs = [
            {
                id: 'home',
                label: 'Home',
                icon: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
                url: '/'
            },
            {
                id: 'leaderboard',
                label: 'Leaderboard',
                icon: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>',
                url: '/leaderboard/'
            },
            {
                id: 'privacy',
                label: 'Privacy',
                icon: '<path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>',
                url: '/privacy/'
            }
        ];
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with id "${this.containerId}" not found`);
            return;
        }

        const currentPath = window.location.pathname;
        const activeTab = this.getActiveTab(currentPath);

        const tabBarHTML = `
            <div class="floating-tab-bar">
                ${this.tabs.map(tab => `
                    <button class="tab-button ${tab.id === activeTab ? 'active' : ''}" data-page="${tab.id}">
                        <svg class="tab-icon" viewBox="0 0 24 24" fill="currentColor">
                            ${tab.icon}
                        </svg>
                        ${tab.label}
                    </button>
                `).join('')}
            </div>
        `;

        container.innerHTML = tabBarHTML;
        this.attachEventListeners();
    }

    getActiveTab(currentPath) {
        if (currentPath === '/privacy/' || currentPath === '/privacy') {
            return 'privacy';
        } else if (currentPath === '/leaderboard/' || currentPath === '/leaderboard') {
            return 'leaderboard';
        } else {
            return 'home';
        }
    }

    attachEventListeners() {
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
                const page = button.getAttribute('data-page');
                this.handleNavigation(page);
            });
        });
    }

    createRipple(event, button) {
        // Remove any existing ripple
        const oldRipple = button.querySelector('.ripple');
        if (oldRipple) oldRipple.remove();
        // Create ripple
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (event.clientX - rect.left - size/2) + 'px';
        ripple.style.top = (event.clientY - rect.top - size/2) + 'px';
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    handleNavigation(tabName) {
        const tab = this.tabs.find(t => t.id === tabName);
        if (tab) {
            window.location.href = tab.url;
        }
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if tab bar container exists
    const container = document.getElementById('tab-bar-container');
    if (container) {
        const tabBar = new TabBar();
        tabBar.render();
    }
}); 