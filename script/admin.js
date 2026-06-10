/* ============================================
   FC27 - ADMIN JAVASCRIPT
   ============================================ */

// === ADMIN DATA ===
const AdminData = {
    stats: {
        totalGoals: 0,
        totalPlayers: 0,
        totalClubs: 0,
        activeCompetitions: 0,
        activeTournaments: 0
    },
    
    pendingResults: [],
    reportedUsers: []
};

// === ADMIN FUNCTIONS ===
const Admin = {
    // Verifica permessi admin
    checkAdminAccess() {
        const user = FC27.Storage.get('user');
        return user && user.isAdmin === true;
    },

    // Crea Torneo
    async createTournament(data) {
        try {
            if (!this.checkAdminAccess()) {
                throw new Error('Permessi insufficienti');
            }

            // Validazione
            if (!data.nome || !data.dataInizio || !data.dataFine) {
                throw new Error('Compila tutti i campi obbligatori');
            }

            const torneo = {
                id: FC27.Utils.generateId(),
                nome: data.nome,
                descrizione: data.descrizione || '',
                dataInizio: data.dataInizio,
                dataFine: data.dataFine,
                costoIscrizione: data.costoIscrizione || 0,
                premi: data.premi || [],
                maxSquadre: data.maxSquadre || 32,
                squadreIscritte: 0,
                stato: 'aperto',
                createdAt: new Date().toISOString()
            };

            // Salva in storage
            const tornei = FC27.Storage.get('tornei') || [];
            tornei.push(torneo);
            FC27.Storage.set('tornei', tornei);

            FC27.Toast.success('Torneo creato con successo!');
            return torneo;
        } catch (error) {
            FC27.Toast.error(error.message);
            throw error;
        }
    },

    // Crea Competizione
    async createCompetition(data) {
        try {
            if (!this.checkAdminAccess()) {
                throw new Error('Permessi insufficienti');
            }

            if (!data.nome || !data.tipologia) {
                throw new Error('Compila tutti i campi obbligatori');
            }

            const competizione = {
                id: FC27.Utils.generateId(),
                nome: data.nome,
                descrizione: data.descrizione || '',
                tipologia: data.tipologia,
                costoIscrizione: data.costoIscrizione || 0,
                premi: data.premi || [],
                partecipanti: 0,
                stato: 'aperta',
                createdAt: new Date().toISOString()
            };

            const competizioni = FC27.Storage.get('competizioni') || [];
            competizioni.push(competizione);
            FC27.Storage.set('competizioni', competizioni);

            FC27.Toast.success('Competizione creata con successo!');
            return competizione;
        } catch (error) {
            FC27.Toast.error(error.message);
            throw error;
        }
    },

    // Crea Club
    async createClub(data) {
        try {
            if (!this.checkAdminAccess()) {
                throw new Error('Permessi insufficienti');
            }

            if (!data.nome || !data.capitano) {
                throw new Error('Compila tutti i campi obbligatori');
            }

            const club = {
                id: FC27.Utils.generateId(),
                nome: data.nome,
                descrizione: data.descrizione || '',
                capitano: data.capitano,
                membri: [data.capitano],
                maxMembri: data.maxMembri || 30,
                createdAt: new Date().toISOString()
            };

            const clubs = FC27.Storage.get('clubs') || [];
            clubs.push(club);
            FC27.Storage.set('clubs', clubs);

            FC27.Toast.success('Club creato con successo!');
            return club;
        } catch (error) {
            FC27.Toast.error(error.message);
            throw error;
        }
    },

    // Inserisci Risultato
    async insertResult(data) {
        try {
            if (!this.checkAdminAccess()) {
                throw new Error('Permessi insufficienti');
            }

            if (!data.competizione || !data.squadraCasa || !data.squadraOspite) {
                throw new Error('Compila tutti i campi obbligatori');
            }

            const risultato = {
                id: FC27.Utils.generateId(),
                competizioneId: data.competizione,
                squadraCasa: data.squadraCasa,
                squadraOspite: data.squadraOspite,
                golCasa: data.golCasa || 0,
                golOspite: data.golOspite || 0,
                dataPartita: data.dataPartita || new Date().toISOString(),
                createdAt: new Date().toISOString()
            };

            const risultati = FC27.Storage.get('risultati') || [];
            risultati.push(risultato);
            FC27.Storage.set('risultati', risultati);

            FC27.Toast.success('Risultato inserito con successo!');
            return risultato;
        } catch (error) {
            FC27.Toast.error(error.message);
            throw error;
        }
    },

    // Ottieni statistiche
    getStats() {
        return {
            totalGoals: FC27.Storage.get('totalGoals') || 0,
            totalPlayers: (FC27.Storage.get('users') || []).length,
            totalClubs: (FC27.Storage.get('clubs') || []).length,
            activeCompetitions: (FC27.Storage.get('competizioni') || []).filter(c => c.stato === 'aperta').length,
            activeTournaments: (FC27.Storage.get('tornei') || []).filter(t => t.stato === 'aperto').length
        };
    },

    // Aggiorna statistiche
    updateStats() {
        const stats = this.getStats();
        
        // Aggiorna UI se presente
        Object.keys(stats).forEach(key => {
            const element = document.getElementById(`stat-${key}`);
            if (element) {
                element.textContent = stats[key];
            }
        });

        return stats;
    }
};

// === FORM HANDLERS ===
function initCreateTournamentForm() {
    const form = document.getElementById('create-tournament-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            nome: formData.get('nome'),
            descrizione: formData.get('descrizione'),
            dataInizio: formData.get('dataInizio'),
            dataFine: formData.get('dataFine'),
            costoIscrizione: parseFloat(formData.get('costoIscrizione')) || 0,
            maxSquadre: parseInt(formData.get('maxSquadre')) || 32
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;

        try {
            await Admin.createTournament(data);
            form.reset();
        } catch (error) {
            console.error(error);
        } finally {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    });
}

function initCreateCompetitionForm() {
    const form = document.getElementById('create-competition-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            nome: formData.get('nome'),
            descrizione: formData.get('descrizione'),
            tipologia: formData.get('tipologia'),
            costoIscrizione: parseFloat(formData.get('costoIscrizione')) || 0
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;

        try {
            await Admin.createCompetition(data);
            form.reset();
        } catch (error) {
            console.error(error);
        } finally {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    });
}

function initCreateClubForm() {
    const form = document.getElementById('create-club-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            nome: formData.get('nome'),
            descrizione: formData.get('descrizione'),
            capitano: formData.get('capitano'),
            maxMembri: parseInt(formData.get('maxMembri')) || 30
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;

        try {
            await Admin.createClub(data);
            form.reset();
        } catch (error) {
            console.error(error);
        } finally {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    });
}

function initInsertResultForm() {
    const form = document.getElementById('insert-result-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            competizione: formData.get('competizione'),
            squadraCasa: formData.get('squadraCasa'),
            squadraOspite: formData.get('squadraOspite'),
            golCasa: parseInt(formData.get('golCasa')) || 0,
            golOspite: parseInt(formData.get('golOspite')) || 0,
            dataPartita: formData.get('dataPartita')
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;

        try {
            await Admin.insertResult(data);
            form.reset();
        } catch (error) {
            console.error(error);
        } finally {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    });
}

// === INIT ADMIN ===
document.addEventListener('DOMContentLoaded', () => {
    initCreateTournamentForm();
    initCreateCompetitionForm();
    initCreateClubForm();
    initInsertResultForm();
    
    // Aggiorna stats se in dashboard admin
    if (document.getElementById('admin-dashboard')) {
        Admin.updateStats();
    }
});

// Esponi globalmente
window.Admin = Admin;