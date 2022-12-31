export interface BilletAbsence {
    id: number;
    etudiantId: number;
    surveillantId: string;
    motif: string;
    formateurId: string;
    heure: number;
    minutes: number;
    periode: Date;
    filiere: string;
    niveau: string;
    groupe: string;
    surveillant: string;
    etudiant: string;
}