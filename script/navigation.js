/* ============================================
   FC27 - NAVIGATION JAVASCRIPT
   ============================================ */

// === PAGINE APPLICAZIONE ===
const PAGES = {
    // Flusso iniziale
    loading: 'caricamento.html',
    tutorial: 'tutorial.html',
    homeNonLoggato: 'home-non-loggato.html',
    
    // Autenticazione
    registrazione: 'registrazione.html',
    accesso: 'accesso.html',
    
    // Area utente
    home: 'home.html',
    notifiche: 'notifiche.html',
    profilo: 'profilo.html',
    
    // Competizioni
    competizioni: 'competizioni.html',
    competizioniInfo: 'competizioni-info.html',
    competizioniAccesso: 'competizioni-accesso.html',
    
    // Tornei
    tornei: 'tornei.html',
    torneiInfo: 'tornei-info.html',
    torneiLimitazioni: 'tornei-limitazioni.html',
    
    // Club
    club: 'club.html',
    clubChat: 'club-chat.html',
    clubFormazione: 'club-formazione.html',
    clubInfo: 'club-info.html',
    
    // Admin
    admin: 'admin.html',
    adminCreaTorneo: 'admin-crea-torneo.html',
    adminCreaCompetizione: 'admin-crea-competizione.html',
    adminCreaClub: 'admin-crea-club.html',
    adminInserisciRisultati: 'admin-inserisci-risultati.html',
    
    // Altro
    regolamento: 'regolamento.html',
    faq: 'faq.html',
    segnalazione: 'segnalazione.html',
    impostazioni: 'impostazioni.html'
};

// === MENU NAVIGATION ===
const MENU_ITEMS = {
    main: [
        { id: 'home', label: 'Home', icon: 'fa-home', page: 'home.html' },
        { id: 'competizioni', label: 'Competizioni', icon: 'fa-trophy', page: 'competizioni.html' },
        { id: 'tornei', label: 'Tornei', icon: 'fa-medal', page: 'tornei.html' },
        { id: 'club', label: 'Club', icon: 'fa-users', page: 'club.html' }
    ],
    secondary: [
        { id: 'notifiche', label: 'Notifiche', icon: 'fa-bell', page: 'notifiche.html' },
        { id: 'profilo', label: 'Profilo', icon: 'fa-user', page: 'profilo.html' },
        { id: 'regolamento', label: 'Regolamento', icon: 'fa-book', page: 'regolamento.html' },
        { id: 'faq', label: 'FAQ', icon: 'fa-question-circle', page: 'faq.html' },
        { id: 'segnalazione', label: 'Segnalazione', icon: 'fa-flag', page: 'segnalazione.html' },
        { id: 'impostazioni', label: 'Impostazioni', icon: 'fa-cog', page: 'impostazioni.html' }
    ],
    admin: [
        { id: 'admin', label: 'Dashboard Admin', icon: 'fa-shield-alt', page: 'admin.html', adminOnly: true },
        { id: 'admin-crea-torneo', label: 'Crea Torneo', icon: 'fa-plus', page: 'admin-crea-torneo.html', adminOnly: true },
        { id: 'admin-crea-competizione', label: 'Crea Competizione', icon: 'fa-plus', page: 'admin-crea-competizione.html', adminOnly: true },
        { id: 'admin-crea-club', label: 'Crea Club', icon: 'fa-plus', page: 'admin-crea-club.html', adminOnly: true },
        { id: 'admin-risultati', label: 'Inserisci Risultati', icon: 'fa-edit', page: 'admin-inserisci-risultati.html', adminOnly: true }
    ]
};

// === GENERA SIDEBAR ===
function generateSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const currentUser = FC27.Storage.get('user');
    const isAdmin = currentUser && currentUser.isAdmin;

    let html = `
        <div class="sidebar-header">
            <div class="logo-container">
                <div class="logo">FC</div>
                <span class="site-name">FC27</span>
            </div>
            <button class="sidebar-close" onclick="FC27.Sidebar.close()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <nav class="sidebar-nav">
            <div class="nav-section">
                <div class="nav-section-title">Menu Principale</div>
                ${MENU_ITEMS.main.map(item => `
                    <a href="${item.page}" class="nav-link" data-page="${item.id}">
                        <i class="fas ${item.icon}"></i>
                        <span>${item.label}</span>
                    </a>
                `).join('')}
            </div>
            
            <div class="nav-section">
                <div class="nav-section-title">Account</div>
                ${MENU_ITEMS.secondary.map(item => `
                    <a href="${item.page}" class="nav-link" data-page="${item.id}">
                        <i class="fas ${item.icon}"></i>
                        <span>${item.label}</span>
                    </a>
                `).join('')}
            </div>
            
            ${isAdmin ? `
                <div class="nav-section">
                    <div class="nav-section-title">Amministrazione</div>
                    ${MENU_ITEMS.admin.map(item => `
                        <a href="${item.page}" class="nav-link admin-link" data-page="${item.id}">
                            <i class="fas ${item.icon}"></i>
                            <span>${item.label}</span>
                        </a>
                    `).join('')}
                </div>
            ` : ''}
        </nav>
    `;

    sidebar.innerHTML = html;
}

// === GENERA HEADER ===
function generateHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    const currentUser = FC27.Storage.get('user');
    const isLogged = currentUser !== null;

    let html = `
        <div class="header-left">
            <div class="logo-container">
                <div class="logo">FC</div>
                <span class="site-name">FC27</span>
            </div>
            ${isLogged ? `
                <span class="user-greeting">Benvenuto, <span>${currentUser.nomeEA || currentUser.gamertag}</span></span>
            ` : ''}
        </div>
        
        <div class="header-right">
            ${isLogged ? `
                <button class="header-btn" onclick="FC27.Navigation.navigateTo('notifiche.html')">
                    <i class="fas fa-bell"></i>
                    <span class="badge" id="notification-badge" style="display: none;">0</span>
                </button>
            ` : ''}
            <button class="header-btn" id="menu-toggle">
                <i class="fas fa-bars"></i>
            </button>
        </div>
    `;

    header.innerHTML = html;
}

// === PAGE TRANSITIONS ===
function initPageTransitions() {
    const links = document.querySelectorAll('a[href$=".html"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Se è un link esterno o nuovo tab, non intervenire
            if (link.target === '_blank' || href.startsWith('http')) {
                return;
            }

            e.preventDefault();
            
            // Aggiungi classe per animazione uscita
            document.body.classList.add('page-exit');
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
}

// === INIT NAVIGATION ===
document.addEventListener('DOMContentLoaded', () => {
    generateHeader();
    generateSidebar();
    initPageTransitions();
    
    // Setup menu toggle dopo aver generato l'header
    const menuBtn = document.getElementById('menu-toggle');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => FC27.Sidebar.toggle());
    }
});