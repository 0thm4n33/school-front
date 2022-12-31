import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterResponse } from 'src/app/viewModels/auth.vm';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(private authService: AuthService) {}

  errors: any[] = [];
  matricule: string = '';
  mdp: string = '';
  mdpConfirmation: string = '';
  typeUtilisateur: string = 'ROLE_FORMATEUR';
  userCreated: boolean = false;

  ngOnInit(): void {}

  async register() {
    this.userCreated = false;
    this.errors = [];
    let response: RegisterResponse = await this.authService.register(
      this.matricule,
      this.mdp,
      this.mdpConfirmation,
      this.typeUtilisateur
    );
    if (response.code === 201) {
      this.userCreated = true;
      return;
    }
    if (response.code === 409) {
      this.errors.push("Matricule déjà utilisé");
      return;
    }
    let fields = Object.keys(response.errors);
    fields.forEach((field) => {
      response.errors[field].forEach((err: any) => {
        this.errors.push(err);
      });
    });
  }
}
