import { Filiere } from "./filiere.model";

export interface Groupe {
    id: number;
    intitule: string;
    normalizedIntitule: string;
    filiereId: number;
    filiere?: Filiere;
    filiereIntitule?: string;
    filiereCode?: string;
}
