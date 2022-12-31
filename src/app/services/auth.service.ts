import { Injectable } from '@angular/core';
import { API_ROUTES } from '../routes';
import { LoginResponse, RegisterResponse } from '../viewModels/auth.vm';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  async logout() {
    let response = await fetch(API_ROUTES.auth.logout, {
      credentials: 'include',
    });
    localStorage.clear()
  }

  async login(matricule: string, mdp: string): Promise<LoginResponse> {
    let response = await fetch(API_ROUTES.auth.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matricule, mdp }),
      credentials: 'include',
    });
    if (response.status === 200) {
      return { success: true, user: await response.json() };
    } else {
      return { success: false, user: null };
    }
  }

  async register(
    matricule: string,
    mdp: string,
    mdpConfirmation: string,
    typeUtilisateur: string
  ): Promise<RegisterResponse> {
    let response = await fetch(API_ROUTES.auth.register, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        matricule,
        mdp,
        mdpConfirmation,
        typeUtilisateur,
      }),
    });
    let responseBody = await response.json();
    let toReturn: RegisterResponse = {} as RegisterResponse;
    toReturn.code = response.status;
    switch (toReturn.code) {
      case 201:
        toReturn.user = responseBody;
        break;
      case 409:
        toReturn.errors = ['Matricule déjà utilisé'];
        break;
      case 500:
        toReturn.errors = ['Erreur serveur'];
        break;
      case 400:
        toReturn.errors = responseBody.errors;
        break;
    }
    return toReturn;
  }
}
