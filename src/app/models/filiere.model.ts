import { Groupe } from "./groupe.model";
import { Niveau } from "./niveau.model";

export interface Filiere {
    id: number;
    intitule: string;
    normalizedIntitule: string;
    groupes?: Groupe[];
    niveauId: number;
    niveau?: Niveau;
    code?: string;
    niveauIntitule?: string;
}