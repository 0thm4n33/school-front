const server= "http://localhost:5000";

export const API_ROUTES = {
    auth: {
        register: `${server}/auth/register`,
        login: `${server}/auth/login`,
        logout: `${server}/auth/logout`
    },
    niveau: {
        getAll: `${server}/api/niveaux`,
        findById: `${server}/api/niveaux`,
        create: `${server}/api/niveaux`,
        delete: `${server}/api/niveaux`,
        update: `${server}/api/niveaux`
    },
    etudiant: {
        getAll: `${server}/api/etudiants`,
        getInGroupe: `${server}/api/etudiants/groupe`,
        delete: `${server}/api/etudiants`,
        create: `${server}/api/etudiants`
    },
    absence: {
        updateAbsencesEtudiants: `${server}/api/absences/etudiants`
    },
    user: {
        findById: `${server}/api/users`,
        findByRole: `${server}/api/users/type`
    },
    groupe: {
        findById: `${server}/api/groupes`,
        delete: `${server}/api/groupes`,
        getAll: `${server}/api/groupes`,
        create: `${server}/api/groupes`,
        update: `${server}/api/groupes`
    },
    filiere: {
        findById: `${server}/api/filieres`,
        getAll: `${server}/api/filieres`,
        create: `${server}/api/filieres`,
        delete: `${server}/api/filieres`,
        update: `${server}/api/filieres`
    },
    billetAbsence: {
        getAll: `${server}/api/billetsabsence`,
        create: `${server}/api/billetsabsence`
    }
}