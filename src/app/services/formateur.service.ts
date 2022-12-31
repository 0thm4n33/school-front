import { Injectable } from '@angular/core';
import { BilletAbsence } from '../models/billet-absence.model';
import { Etudiant } from '../models/etudiant.model';
import { API_ROUTES } from '../routes';

@Injectable({
  providedIn: 'root'
})
export class FormateurService {

  constructor() { }

  async getAll() {
    let response = await fetch(API_ROUTES.niveau.getAll, {
      credentials: 'include'
    });
    return await response.json();
  }

  async loadEtudiants(groupeId: number, jour?: number, mois?: number, annee?: number): Promise<Etudiant[]> {
    let ext = '';
    if(jour !== undefined && mois !== undefined && annee !== undefined) {
      ext = `?jour=${jour}&mois=${mois}&annee=${annee}`;
    }
    let response = await fetch(`${API_ROUTES.etudiant.getInGroupe}/${groupeId}${ext}`, {
      credentials: 'include'
    });
    return await response.json();
  }

  async getBillets(formateur: string): Promise<BilletAbsence[]> {
    let response = await fetch(`${API_ROUTES.billetAbsence.getAll}?formateur=${formateur}`, {
      credentials: "include"
    });
    return await response.json();
  }

  async validateBilletAbsence(id: number): Promise<boolean> {
    let response = await fetch(API_ROUTES.billetAbsence.getAll+"/"+id, {
      method: "put",
      credentials: "include"
    });
    return response.status === 200 ? true : false;
  }

  async updateAbsencesEtudiants(etudiants: Etudiant[]): Promise<boolean> {
    let response = await fetch(API_ROUTES.absence.updateAbsencesEtudiants, {
      method:"put",
      credentials: "include",
      headers: {
        "Content-Type":"application/json"
      },
      body:JSON.stringify(etudiants)
    });
    if(response.status === 200) {
      return true;
    }
    return false;
  }
}
