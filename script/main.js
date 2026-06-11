const CONFIG = {
    appName: "FC27",
    version: "1.0.0",
    defaultRedirect: "home-non-loggato.html",
    loadingDuration: 3000,
    toastDuration: 4000
};

const APP_STATE = {
    isLoading: false,
    isLogged: false,
    currentUser: null,
    isAdmin: false,
    currentClub: null,
    theme: 'dark',
    currentPage: ''
};

const Utils = {
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    },

    formatDate(date) {
        return new Date(date).toLocaleDateString('it-IT', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    },

    formatTime(date) {
        return new Date(date).toLocaleDateString('it-IT', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    sanizite(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
};

const Storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },

    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    }
};

const Toast = {
    container: null,

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'info', duration = CONFIG.toastDuration) {
        this.init();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
        <i class="fas ${iconMap[type]}"></i>
        <span>${Utils.sanizite(message)}</span>
        `;

        this.container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reserve';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    success(message) {
        this.show(message, 'success');
    },

    error(message) {
        this.show(message, 'error');
    },

    warning(message) {
        this.show(message, 'warning');
    },

    info(message) {
        this.show(message, 'info');
    }
};

const Sidebar = {
    sidebar: null,
    overlay: null,

    init() {
        this.sidebar = document.getElementById('sidebar');
        this.overlay = document.getElementById('sidebar-overlay'); // Nota: nell'HTML usi id="overlay"

        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    },

    open() {
        if (this.sidebar && this.overlay) {
            this.sidebar.classList.add('active');
            this.overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    close() {
        if (this.sidebar && this.overlay) {
            this.sidebar.classList.remove('active');
            this.overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    toggle() {
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    },

    isOpen() {
        return this.sidebar && this.sidebar.classList.contains('active');
    }
};

const Navigation = {
    navigateTo(page) {
        window.location.href = page;
    },

    goBack() {
        window.history.back();
    },

    setActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }
};

const loadingScreen = { // Nota: variabile definita con lettera minuscola
    element: null,
    progressBar: null,
    statusText: null,

    init() {
        this.element = document.getElementById('loading-screen');
        this.progressBar = document.getElementById('progress-fill');
        this.statusText = document.getElementById('loading-status');
    },

    show() {
        if (this.element) {
            this.element.style.display = 'flex';
        }
    },

    hide() {
        if (this.element) {
            this.element.style.opacity = '0';
            setTimeout(() => {
                this.element.style.display = 'none';
            }, 500);
        }
    },

    setProgress(value) {
        if (this.progressBar) {
            this.progressBar.style.width = `${Math.min(100, Math.max(0, value))}%`;
        }
    },

    setStatus(text) {
        if (this.statusText) {
            this.statusText.textContent = text;
        }
    },

    async simulateLoading() {
        const steps = [
            { progress: 20, status: 'Inizializzazione...' },
            { progress: 40, status: 'Caricamento risorse...' },
            { progress: 60, status: 'Connessione al server...' },
            { progress: 80, status: 'Preparazione interfaccia...' },
            { progress: 100, status: 'Caricamento completato!' }
        ];

        for (const step of steps) {
            await new Promise(resolve => setTimeout(resolve, 600));
            this.setProgress(step.progress);
            this.setStatus(step.status);
        }

        await new Promise(resolve => setTimeout(resolve, 300));
    }
};

const Tutorial = {
    currentSlide: 0,
    slides: [],
    dots: [],

    init() {
        this.slides = document.querySelectorAll('.tutorial-slide');
        this.dots = document.querySelectorAll('.tutorial-dot');

        if (this.slides.length > 0) {
            this.showSlide(0);
        }
    },

    showSlide(index) {
        if (index < 0 || index >= this.slides.length) return;

        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });

        this.slides[index].classList.add('active');
        this.currentSlide = index;

        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    },

    next() {
        if (this.currentSlide < this.slides.length - 1) {
            this.showSlide(this.currentSlide + 1);
        }
    },

    prev() {
        if (this.currentSlide > 0) {
            this.showSlide(this.currentSlide - 1);
        }
    },

    skip() {
        Navigation.navigateTo('home-non-loggato.html');
    },

    complete() {
        Storage.set('tutorial_completed', true);
        Navigation.navigateTo('home-non-loggato.html');
    }
};

const ScrollReveal = {
    elements: [],

    init() {
        this.elements = document.querySelectorAll('.reveal');
        this.observe();
    },

    observe() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(el => observer.observe(el));
    }
};

const Theme = {
    toggle() {
        const currentTheme = APP_STATE.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        APP_STATE.theme = newTheme;
        Storage.set('theme', newTheme);
    },

    init() {
        const savedTheme = Storage.get('theme') || 'dark';
        APP_STATE.theme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Theme.init();
    Sidebar.init();
    ScrollReveal.init();

    const menuBtn = document.getElementById('menu-toggle');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => Sidebar.toggle());
    }

    Navigation.setActiveLink();

    if (document.querySelector('.tutorial-container')) {
        Tutorial.init();
    }

    if (document.getElementById('loading-screen')) {
        loadingScreen.init();
    }

    console.log(`${CONFIG.appName} v${CONFIG.version} - Inizializzato`)
});

window.FC27 = {
    APP_STATE,
    Utils,
    Storage,
    Toast,
    Sidebar,
    Navigation,
    loadingScreen, // CORREZIONE: Cambiato da LoadingScreen a loadingScreen
    Tutorial,
    Theme,
    CONFIG
};
