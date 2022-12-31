import { Absence } from "./absence.model";
import { Groupe } from "./groupe.model";

export interface Etudiant {
    id: number;
    nom: string;
    prenom: string;
    cin: string;
    code: string;
    adresse: string;
    tel: string;
    dateNaissance: string;
    photo: string;
    groupeId: number;
    filiereId: number;
    niveauId: number;
    absences: Absence[];
    jourAbsence: Absence;
    validationErrors: string[];
    filiereIntitule: string;
    groupeIntitule: string;
    niveauIntitule: string;
    cumJour: number;
}
