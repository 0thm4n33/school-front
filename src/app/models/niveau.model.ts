import { Filiere } from "./filiere.model";

export interface Niveau {
    id: number;
    intitule: string;
    normalizedIntitule: string;
    filieres?: Filiere[];
}
