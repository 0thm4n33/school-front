import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  espace: string = "Admin";
  page: string = "Administration Page";
  errors: any[] = [];
  matricule: string = '';
  mdp: string = '';
  mdpConfirmation: string = '';
  typeUtilisateur: string = 'Admin';
  roles: string[] = ["Admin","Surveillant","Formateur"];

  constructor(private authService:AuthService,private router:Router) { }

  ngOnInit(): void {

  }

  async onSubmit(){
    if(this.matricule == "" || this.mdp == ""){
      this.errors.push("Veuillez remplir le matricule et le mot de passe");
    }else{
      this.errors = [];
      let response = await this.authService.register(this.matricule,this.mdp,this.mdp,
        `ROLE_${this.typeUtilisateur.toUpperCase()}`);
      if(response.code === 201){
        Swal.fire("Création Utilisateur", "Utilisateur créée!", "success");
        this.router.navigateByUrl('admin/list-users');
      }else{
        this.errors.push(response.errors);
      }
    }
  }

  clearForm():void{
    this.matricule = '';
    this.mdp = '';
  }

}
