// iOS 18/iPadOS Style Tab Bar Component
class ModernTabBar {
    constructor(containerId = 'tab-bar-container') {
        this.containerId = containerId;
        this.currentTab = null;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.lastTapTime = 0;
        this.longPressTimer = null;
        this.vibrationEnabled = 'vibrate' in navigator;
        
        this.tabs = [
            {
                id: 'home',
                label: 'Home',
                icon: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
                url: '/',
                badge: null,
                disabled: false
            },
            {
                id: 'leaderboard',
                label: 'Leaderboard',
                icon: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>',
                url: '/leaderboard/',
                badge: null,
                disabled: false
            },
            {
                id: 'privacy',
                label: 'Privacy',
                icon: '<path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>',
                url: '/privacy/',
                badge: null,
                disabled: false
            }
        ];
        
        this.init();
    }

    init() {
        this.render();
        this.setupAccessibility();
        this.setupGestureRecognition();
        this.setupKeyboardNavigation();
        this.setupResizeObserver();
        this.setupIntersectionObserver();
    }

    render() {
        console.log('Rendering tab bar...');
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with id "${this.containerId}" not found`);
            return;
        }

        const currentPath = window.location.pathname;
        const activeTab = this.getActiveTab(currentPath);
        this.currentTab = activeTab;
        console.log('Active tab:', activeTab);

        const tabBarHTML = `
            <div class="floating-tab-bar" role="tablist" aria-label="Main navigation">
                <div class="tab-bg-highlight" aria-hidden="true"></div>
                <div class="tab-ripple-container" aria-hidden="true"></div>
                ${this.tabs.map((tab, index) => `
                    <button 
                        class="tab-button ${tab.id === activeTab ? 'active' : ''} ${tab.disabled ? 'disabled' : ''}"
                        data-page="${tab.id}"
                        data-index="${index}"
                        role="tab"
                        aria-selected="${tab.id === activeTab}"
                        aria-label="${tab.label}"
                        ${tab.disabled ? 'aria-disabled="true"' : ''}
                        tabindex="${tab.id === activeTab ? '0' : '-1'}"
                    >
                        <div class="tab-icon-container">
                            <svg class="tab-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                ${tab.icon}
                            </svg>
                            ${tab.badge ? `<span class="tab-badge" aria-label="${tab.badge} new items">${tab.badge}</span>` : ''}
                        </div>
                        <span class="tab-label">${tab.label}</span>
                        <div class="tab-touch-target"></div>
                    </button>
                `).join('')}
            </div>
        `;

        container.innerHTML = tabBarHTML;
        console.log('Tab bar HTML inserted into container');
        this.positionBackground();
        console.log('Tab bar rendering complete');
    }

    positionBackground(tabIndex = null, animate = true) {
        const tabBar = document.querySelector('.floating-tab-bar');
        const bgHighlight = tabBar?.querySelector('.tab-bg-highlight');
        const buttons = Array.from(tabBar?.querySelectorAll('.tab-button') || []);
        
        if (!bgHighlight || buttons.length === 0) return;
        
        let index = tabIndex;
        if (index === null) {
            index = buttons.findIndex(btn => btn.classList.contains('active'));
        }
        
        if (index < 0 || !buttons[index]) return;
        
        const btn = buttons[index];
        const rect = btn.getBoundingClientRect();
        const tabBarRect = tabBar.getBoundingClientRect();
        
        bgHighlight.style.width = `${btn.offsetWidth}px`;
        bgHighlight.style.height = `${btn.offsetHeight}px`;
        bgHighlight.style.top = `${btn.offsetTop}px`;
        bgHighlight.style.left = `${btn.offsetLeft}px`;
        bgHighlight.style.transition = animate ? 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        
        // Add subtle scale animation for active tab
        if (animate) {
            btn.style.transform = 'scale(1.05)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 200);
        }
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

    setupAccessibility() {
        const tabBar = document.querySelector('.floating-tab-bar');
        const buttons = tabBar?.querySelectorAll('.tab-button');
        
        if (!buttons) return;
        
        buttons.forEach(button => {
            // Add focus management
            button.addEventListener('focus', () => {
                this.handleFocus(button);
            });
            
            button.addEventListener('blur', () => {
                this.handleBlur(button);
            });
            
            // Add keyboard navigation
            button.addEventListener('keydown', (e) => {
                this.handleKeyDown(e, button);
            });
        });
    }

    setupGestureRecognition() {
        const tabBar = document.querySelector('.floating-tab-bar');
        const bgHighlight = tabBar?.querySelector('.tab-bg-highlight');
        const buttons = Array.from(tabBar?.querySelectorAll('.tab-button') || []);
        
        if (!tabBar || !bgHighlight) return;

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let velocity = 0;
        let lastX = 0;
        let lastTime = 0;

        const getClosestTabIdx = (x) => {
            let minDist = Infinity;
            let idx = 0;
            buttons.forEach((btn, i) => {
                if (btn.classList.contains('disabled')) return;
                const rect = btn.getBoundingClientRect();
                const center = rect.left + rect.width / 2;
                const dist = Math.abs(x - center);
                if (dist < minDist) {
                    minDist = dist;
                    idx = i;
                }
            });
            return idx;
        };

        const createRipple = (x, y) => {
            const rippleContainer = tabBar.querySelector('.tab-ripple-container');
            const ripple = document.createElement('div');
            ripple.className = 'tab-ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            rippleContainer.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        };

        const onMove = (e) => {
            if (!isDragging) return;
            
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const currentTime = Date.now();
            
            // Calculate velocity
            if (lastTime > 0) {
                velocity = (clientX - lastX) / (currentTime - lastTime);
            }
            lastX = clientX;
            lastTime = currentTime;
            
            const deltaX = clientX - startX;
            const deltaY = clientY - startY;
            
            // Check if this is primarily a horizontal gesture
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
                e.preventDefault();
                
                const newLeft = startLeft + deltaX;
                const minLeft = 0;
                const maxLeft = tabBar.offsetWidth - bgHighlight.offsetWidth;
                const clampedLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
                
                bgHighlight.style.transition = 'none';
                bgHighlight.style.left = `${clampedLeft}px`;
                
                // Add resistance at edges
                if (newLeft < minLeft || newLeft > maxLeft) {
                    bgHighlight.style.transform = `scaleX(${0.95 + Math.abs(deltaX) * 0.001})`;
                } else {
                    bgHighlight.style.transform = 'scaleX(1)';
                }
            }
        };

        const onUp = (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.removeEventListener('touchmove', onMove, { passive: false });
            document.removeEventListener('touchend', onUp);
            
            const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
            const idx = getClosestTabIdx(clientX);
            
            // Snap to nearest tab with momentum
            this.positionBackground(idx, true);
            bgHighlight.style.transform = 'scaleX(1)';
            
            // Add haptic feedback
            this.triggerHapticFeedback('light');
            
            setTimeout(() => {
                this.handleNavigation(buttons[idx].getAttribute('data-page'));
            }, 200);
        };

        // Mouse events
        bgHighlight.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseFloat(bgHighlight.style.left) || 0;
            lastX = startX;
            lastTime = Date.now();
            velocity = 0;
            
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
        
        // Touch events
        bgHighlight.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startLeft = parseFloat(bgHighlight.style.left) || 0;
            lastX = startX;
            lastTime = Date.now();
            velocity = 0;
            
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('touchend', onUp);
        });

        // Add tap and long press to individual buttons
        buttons.forEach(button => {
            let pressTimer = null;
            let hasMoved = false;
            
            const handlePressStart = (e) => {
                if (button.classList.contains('disabled')) return;
                
                hasMoved = false;
                const rect = button.getBoundingClientRect();
                const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
                const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
                
                createRipple(x, y);
                
                pressTimer = setTimeout(() => {
                    this.handleLongPress(button);
                }, 500);
            };
            
            const handlePressMove = (e) => {
                if (pressTimer) {
                    const moveThreshold = 10;
                    const deltaX = Math.abs((e.touches ? e.touches[0].clientX : e.clientX) - startX);
                    const deltaY = Math.abs((e.touches ? e.touches[0].clientY : e.clientY) - startY);
                    
                    if (deltaX > moveThreshold || deltaY > moveThreshold) {
                        hasMoved = true;
                        clearTimeout(pressTimer);
                        pressTimer = null;
                    }
                }
            };
            
            const handlePressEnd = (e) => {
                if (pressTimer) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                }
                
                if (!hasMoved) {
                    this.handleTabTap(button);
                }
            };
            
            button.addEventListener('mousedown', handlePressStart);
            button.addEventListener('mousemove', handlePressMove);
            button.addEventListener('mouseup', handlePressEnd);
            button.addEventListener('mouseleave', () => {
                if (pressTimer) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                }
            });
            
            button.addEventListener('touchstart', handlePressStart);
            button.addEventListener('touchmove', handlePressMove);
            button.addEventListener('touchend', handlePressEnd);
        });
    }

    setupKeyboardNavigation() {
        const tabBar = document.querySelector('.floating-tab-bar');
        const buttons = Array.from(tabBar?.querySelectorAll('.tab-button') || []);
        
        buttons.forEach(button => {
            button.addEventListener('keydown', (e) => {
                const currentIndex = parseInt(button.getAttribute('data-index'));
                
                switch (e.key) {
                    case 'ArrowRight':
                        e.preventDefault();
                        this.focusTab((currentIndex + 1) % buttons.length);
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.focusTab(currentIndex === 0 ? buttons.length - 1 : currentIndex - 1);
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.focusTab(0);
                        break;
                    case 'End':
                        e.preventDefault();
                        this.focusTab(buttons.length - 1);
                        break;
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        this.handleTabTap(button);
                        break;
                }
            });
        });
    }

    setupResizeObserver() {
        const tabBar = document.querySelector('.floating-tab-bar');
        if (!tabBar) return;
        
        const resizeObserver = new ResizeObserver(() => {
            this.positionBackground();
        });
        
        resizeObserver.observe(tabBar);
    }

    setupIntersectionObserver() {
        const tabBar = document.querySelector('.floating-tab-bar');
        if (!tabBar) return;
        
        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        tabBar.classList.add('visible');
                    } else {
                        tabBar.classList.remove('visible');
                    }
                });
            },
            { threshold: 0.1 }
        );
        
        intersectionObserver.observe(tabBar);
    }

    handleTabTap(button) {
        const tabName = button.getAttribute('data-page');
        const currentTime = Date.now();
        
        // Double tap detection
        if (currentTime - this.lastTapTime < 300) {
            this.handleDoubleTap(button);
            return;
        }
        
        this.lastTapTime = currentTime;
        
        // Add tap animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
        
        this.triggerHapticFeedback('light');
        this.handleNavigation(tabName);
    }

    handleDoubleTap(button) {
        this.triggerHapticFeedback('medium');
        // Add double tap functionality here if needed
    }

    handleLongPress(button) {
        this.triggerHapticFeedback('heavy');
        // Add long press functionality here if needed
    }

    handleFocus(button) {
        button.classList.add('focused');
        this.triggerHapticFeedback('light');
    }

    handleBlur(button) {
        button.classList.remove('focused');
    }

    handleKeyDown(e, button) {
        // Additional keyboard handling if needed
    }

    focusTab(index) {
        const buttons = document.querySelectorAll('.tab-button');
        if (buttons[index]) {
            buttons[index].focus();
            this.triggerHapticFeedback('light');
        }
    }

    triggerHapticFeedback(type) {
        if (!this.vibrationEnabled) return;
        
        const patterns = {
            light: [10],
            medium: [20],
            heavy: [30]
        };
        
        try {
            navigator.vibrate(patterns[type] || [10]);
        } catch (e) {
            // Fallback for browsers that don't support vibration
        }
    }

    handleNavigation(tabName) {
        const tab = this.tabs.find(t => t.id === tabName);
        if (tab && !tab.disabled) {
            // Update active state
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
                btn.setAttribute('tabindex', '-1');
            });
            
            const activeButton = document.querySelector(`[data-page="${tabName}"]`);
            if (activeButton) {
                activeButton.classList.add('active');
                activeButton.setAttribute('aria-selected', 'true');
                activeButton.setAttribute('tabindex', '0');
            }
            
            // Navigate
            window.location.href = tab.url;
        }
    }

    // Public API methods
    setBadge(tabId, count) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (tab) {
            tab.badge = count;
            this.render();
        }
    }

    setDisabled(tabId, disabled) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (tab) {
            tab.disabled = disabled;
            this.render();
        }
    }

    updateTab(tabId, updates) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (tab) {
            Object.assign(tab, updates);
            this.render();
        }
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing tab bar...');
    const container = document.getElementById('tab-bar-container');
    if (container) {
        console.log('Tab bar container found, creating ModernTabBar...');
        window.modernTabBar = new ModernTabBar();
        console.log('ModernTabBar initialized successfully');
    } else {
        console.error('Tab bar container not found!');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernTabBar;
} 