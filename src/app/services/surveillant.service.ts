import { Injectable } from '@angular/core';
import { BilletAbsence } from '../models/billet-absence.model';
import { Etudiant } from '../models/etudiant.model';
import { Filiere } from '../models/filiere.model';
import { Groupe } from '../models/groupe.model';
import { Niveau } from '../models/niveau.model';
import { User } from '../models/user.model';
import { API_ROUTES } from '../routes';

@Injectable({
  providedIn: 'root',
})

export class SurveillantService {

  async updateFiliere(id: number, intitule: string, code: string, niveauId: number): Promise<Filiere> {
    let response = await fetch(`${API_ROUTES.filiere.update}/${id}?intitule=${intitule}&code=${code}&niveauId=${niveauId}`, {
      method: "put",
      credentials: "include"
    });
    if(response.status === 409) return {id: -409} as Filiere;
    if(response.status === 500) return {id: -500} as Filiere;
    return await response.json();
  }

  async createGroupe(intitule: string, filiereId: number) {
    let response = await fetch(`${API_ROUTES.groupe.create}`, {
      method: "post",
      headers: { "Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({intitule, filiereId})
    });
    return response;
  }
  constructor() {}

  async findById(id: string): Promise<User> {
    let response = await fetch(`${API_ROUTES.user.findById}/${id}`, {
      credentials: 'include',
    });
    return await response.json();
  }

  async findByRole(role: string): Promise<User[]> {
    let response = await fetch(`${API_ROUTES.user.findByRole}/${role}`, {
      credentials: 'include',
    });
    return await response.json();
  }

  async findNiveauById(id: number): Promise<Niveau> {
    let response = await fetch(`${API_ROUTES.niveau.findById}/${id}`, {
      credentials: 'include',
    });
    return await response.json();
  }

  async findGroupeById(id: number): Promise<Groupe> {
    let response = await fetch(`${API_ROUTES.groupe.findById}/${id}`, {
      credentials: 'include',
    });
    return await response.json();
  }

  async findFiliereById(id: number): Promise<Filiere> {
    let response = await fetch(`${API_ROUTES.filiere.findById}/${id}`, {
      credentials: 'include',
    });
    return await response.json();
  }

  async getEtudiants(): Promise<Etudiant[]> {
    let response = await fetch(`${API_ROUTES.etudiant.getAll}`, {
      credentials: "include"
    });
    return await response.json();
  }

  async createNiveau(intitule: string): Promise<Niveau> {
    let response = await fetch(`${API_ROUTES.niveau.create}`, {
      credentials: 'include',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intitule }),
    });

    if (response.status === 201) {
      let niveau: Niveau = await response.json();
      return niveau;
    } else {
      return { id: -response.status } as Niveau;
    }
  }

  async updateNiveau(id: number, intitule: string): Promise<Niveau> {
    let response = await fetch(`${API_ROUTES.niveau.update}/${id}?intitule=${intitule}`, {
      method: "put",
      credentials: "include"
    });
    if(response.status === 400) return {id: -400} as Niveau;
    if(response.status === 500) return {id: -500} as Niveau;
    return await response.json();
  }

  async updateGroupe(id:number, intitule: string, filiereId: number): Promise<Groupe> {
    let response = await fetch(`${API_ROUTES.groupe.update}/${id}?intitule=${intitule}&filiereId=${filiereId}`, {
      method: "put",
      credentials: "include"
    });
    if(response.status === 400) return {id: -400} as Groupe;
    if(response.status === 500) return {id: -500} as Groupe;
    return await response.json();
  }

  async getNiveaux(): Promise<Niveau[]> {
    let response = await fetch(`${API_ROUTES.niveau.getAll}`, {
      credentials: 'include',
    });
    return await response.json();
  }

  async getFilieres(): Promise<Filiere[]> {
    let response = await fetch(`${API_ROUTES.filiere.getAll}`, {
      credentials: 'include',
    });
    return await response.json();
  }

  async getGroupes(): Promise<Groupe[]> {
    let response = await fetch(`${API_ROUTES.groupe.getAll}`, {
      credentials: 'include',
    });
    return await response.json();
  }

  async createFiliere(intitule: string, niveauId: number, code: string): Promise<number> {
    let response = await fetch(`${API_ROUTES.filiere.create}`, {
      method: 'post',
      headers: { 'Content-Type' : 'application/json'},
      credentials: 'include',
      body: JSON.stringify({intitule, niveauId, code})
    });
    return response.status;
  }

  async createEtudiant(etudiant: Etudiant): Promise<Etudiant> {
    let response = await fetch(`${API_ROUTES.etudiant.create}`, {
      method: "post",
      headers: { "Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify(etudiant)
    });
    if(response.status === 400) {
      let validationErrors: string[] = await response.json();
      return {validationErrors} as Etudiant;
    }
    return await response.json();
  }

  async deleteObject(type: string, id: number): Promise<boolean> {
    let route = "";
    switch(type) {
      case "niveau":
        route = `${API_ROUTES.niveau.delete}/${id}`;
        break;
      case "filiere":
        route = `${API_ROUTES.filiere.delete}/${id}`;
        break;
      case "groupe":
        route =  `${API_ROUTES.groupe.delete}/${id}`;
        break;
      case "etudiant":
        route = `${API_ROUTES.etudiant.delete}/${id}`;
        break;
    }
    let response = await fetch(route, {
      method: 'delete',
      credentials: 'include'
    });
    if(response.status == 200) return ((await response.json()).deleted)
    return false;
  }

  async createBilletAbsence(absence: BilletAbsence) {
    let response = await fetch(API_ROUTES.billetAbsence.create, {
      method: "post",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(absence)
    });
    return response;
  }
}
