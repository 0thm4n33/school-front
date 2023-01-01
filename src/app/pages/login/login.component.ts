import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errors: any[] = [];
  matricule: string = '';
  mdp: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  async login() {
    localStorage.clear();
    this.errors = [];
    if(this.matricule === "") this.errors.push("Matricule requis");
    if(this.mdp === "") this.errors.push("Mot de passe requis");
    if(this.errors.length > 0) return;
    let loginStatus = await this.authService.login(this.matricule, this.mdp);
    if(loginStatus.success === true) {
      let {id, matricule, role} = loginStatus.user;
      localStorage.setItem("id", id);
      localStorage.setItem("matricule", matricule);
      localStorage.setItem("role", role);
      if(role === "ROLE_SURVEILLANT") {
        window.location.href = "/surveillant";
      } else if(role === "ROLE_FORMATEUR") {
        window.location.href = "/feuille-absence";
      }else if(role === "ROLE_ADMIN"){
        window.location.href = "/admin";
      }
    } else {
      this.errors.push("Informations de connexion invalides");
    }
    return;
  }

}
