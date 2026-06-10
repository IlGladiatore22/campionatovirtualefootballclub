/* ============================================
   FC27 - AUTHENTICATION JAVASCRIPT
   ============================================ */

// === AUTH STATE ===
const AuthState = {
    isLogged: false,
    user: null,
    token: null
};

// === AUTH FUNCTIONS ===
const Auth = {
    // Registrazione
    async register(data) {
        try {
            // Validazione
            if (!data.nomeEA || !data.gamertag || !data.piattaforma || !data.password) {
                throw new Error('Tutti i campi sono obbligatori');
            }

            if (data.password.length < 6) {
                throw new Error('La password deve avere almeno 6 caratteri');
            }

            // Crea utente
            const user = {
                id: FC27.Utils.generateId(),
                nomeEA: data.nomeEA,
                gamertag: data.gamertag,
                piattaforma: data.piattaforma,
                isAdmin: false,
                clubId: null,
                createdAt: new Date().toISOString()
            };

            // Salva in storage
            FC27.Storage.set('user', user);
            FC27.Storage.set('auth_token', FC27.Utils.generateId());

            AuthState.isLogged = true;
            AuthState.user = user;

            FC27.Toast.success('Registrazione completata!');
            
            // Redirect
            setTimeout(() => {
                FC27.Navigation.navigateTo('home.html');
            }, 1000);

            return user;
        } catch (error) {
            FC27.Toast.error(error.message);
            throw error;
        }
    },

    // Login
    async login(gamertag, password) {
        try {
            if (!gamertag || !password) {
                throw new Error('Inserisci gamertag e password');
            }

            // Recupera utente da storage (simulazione)
            const storedUser = FC27.Storage.get('user');
            
            if (!storedUser || storedUser.gamertag !== gamertag) {
                throw new Error('Credenziali non valide');
            }

            // Salva token
            FC27.Storage.set('auth_token', FC27.Utils.generateId());

            AuthState.isLogged = true;
            AuthState.user = storedUser;

            FC27.Toast.success('Accesso effettuato!');
            
            // Redirect
            setTimeout(() => {
                FC27.Navigation.navigateTo('home.html');
            }, 1000);

            return storedUser;
        } catch (error) {
            FC27.Toast.error(error.message);
            throw error;
        }
    },

    // Logout
    logout() {
        FC27.Storage.remove('user');
        FC27.Storage.remove('auth_token');
        
        AuthState.isLogged = false;
        AuthState.user = null;

        FC27.Toast.info('Disconnessione effettuata');
        
        setTimeout(() => {
            FC27.Navigation.navigateTo('home-non-loggato.html');
        }, 500);
    },

    // Verifica auth
    checkAuth() {
        const user = FC27.Storage.get('user');
        const token = FC27.Storage.get('auth_token');

        if (user && token) {
            AuthState.isLogged = true;
            AuthState.user = user;
            return true;
        }

        return false;
    },

    // Require auth
    requireAuth() {
        if (!this.checkAuth()) {
            FC27.Navigation.navigateTo('accesso.html');
            return false;
        }
        return true;
    },

    // Require admin
    requireAdmin() {
        if (!this.requireAuth()) return false;
        
        if (!AuthState.user || !AuthState.user.isAdmin) {
            FC27.Toast.error('Accesso non autorizzato');
            FC27.Navigation.navigateTo('home.html');
            return false;
        }
        
        return true;
    },

    // Get current user
    getCurrentUser() {
        return AuthState.user;
    },

    // Update user
    updateUser(data) {
        if (!AuthState.user) return false;

        AuthState.user = { ...AuthState.user, ...data };
        FC27.Storage.set('user', AuthState.user);
        
        return true;
    }
};

// === FORM HANDLERS ===
function initRegistrationForm() {
    const form = document.getElementById('register-form');
    if (!form) return;

    const platformBtns = form.querySelectorAll('.platform-btn');
    
    // Platform selection
    platformBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            platformBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const platform = form.querySelector('.platform-btn.active');

        const data = {
            nomeEA: formData.get('nomeEA'),
            gamertag: formData.get('gamertag'),
            piattaforma: platform ? platform.value : null,
            password: formData.get('password')
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;

        try {
            await Auth.register(data);
        } catch (error) {
            console.error(error);
        } finally {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    });
}

function initLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;

        try {
            await Auth.login(formData.get('gamertag'), formData.get('password'));
        } catch (error) {
            console.error(error);
        } finally {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    });
}

// === INIT AUTH ===
document.addEventListener('DOMContentLoaded', () => {
    initRegistrationForm();
    initLoginForm();
});

// Esponi globalmente
window.Auth = Auth;