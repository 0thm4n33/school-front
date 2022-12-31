import { Component, OnInit } from '@angular/core';
import { Filiere } from 'src/app/models/filiere.model';
import { Groupe } from 'src/app/models/groupe.model';
import { SurveillantService } from 'src/app/services/surveillant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-groupes',
  templateUrl: './gestion-groupes.component.html',
  styleUrls: ['./gestion-groupes.component.css']
})
export class GestionGroupesComponent implements OnInit {

  constructor(private surveillantService: SurveillantService) { }

  error: string = "";
  filieres: Filiere[] = [];
  groupes: Groupe[] = [];
  filiereId: number = 0;
  intitule: string = "";


  async ngOnInit() {
    this.filieres = await this.surveillantService.getFilieres();
    this.filiereId = this.filieres[0].id;
    this.groupes = await this.surveillantService.getGroupes();
  }

  async deleteGroupe(event: any) {
    Swal.fire({
      title: "Suppression groupe",
      text: "La suppression du groupe supprime les étudiants associés.",
      cancelButtonText: "Annuler",
      confirmButtonText: "Supprimer",
      showCancelButton: true,
      showConfirmButton: true,
      icon: "warning",
      preConfirm: async (confirmDelete) => {
        if(confirmDelete) {
          let id = event.target.id.split("-")[1];
          let deleted = await this.surveillantService.deleteObject("groupe", id);
          if(deleted === true) {
            Swal.fire("Suppression groupe", "Groupe supprimé!", "success");
            this.groupes = await this.surveillantService.getGroupes();
          } else {
            Swal.fire("Suppression groupe", "Erreur de suppression", "error");
          }
        }
      } 
    });
  }
  async createGroupe() {
    this.error = ""
    if(this.intitule === "") {
      this.error = "Veuillez spécifier l'intitulé";
      return;
    }
    let response = await this.surveillantService.createGroupe(this.intitule, this.filiereId);
    if(response.status === 201) {
      Swal.fire("Création groupe", "Groupe créé!", "success");
      this.groupes = await this.surveillantService.getGroupes();
      this.intitule = "";  
      return;
    }
    if(response.status === 400) {
      this.error = "Veuillez spécifier l'intitulé du groupe";
      return;
    }
    if(response.status === 409) {
      Swal.fire("Création groupe", "Un groupe avec le meme intitulé existe déjà pour la filière", "error");
      return;
    }
    if(response.status === 500) {
      Swal.fire("Création groupe", "Erreur serveur", "success");
    }
  }

  async modifyGroupe(event: any) {
    let id = event.target.id.split("-")[1];
    let g = this.groupes.find(el => el.id == id);
    Swal.fire({
      title: `Modifier groupe : ${g?.normalizedIntitule}`,
      width: '600px',
      html: `
        <div>
          <div class='form-group'>
            <label class='form-label'>Nouvel intitulé</label>
            <input class='form-control' id='newIntitule'>
          </div>
          <div class='form-group'>
            <label class='form-label'>Nouvelle filière</label>
            <select class='form-select' id='newFiliere'></select>
          </div>
        </div>
      `,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Mettre à jour',
      cancelButtonText: 'Annuler',
      icon: 'question',
      didOpen: () => {
        let filiereSelect: any = document.getElementById("newFiliere");
        this.filieres.forEach(el => {
          filiereSelect.innerHTML+= `
            <option value="${el.id}">${el.normalizedIntitule}</option>
          `
        })
      },
      preConfirm: async () => {
        let intituleField: any = document.getElementById("newIntitule");
        let filiereSelect: any = document.getElementById("newFiliere");
        if(intituleField.value === undefined || intituleField.value === "") {
          Swal.showValidationMessage("Veuillez spécifier le nouvel intitulé");
        }
        let response = await this.surveillantService.updateGroupe(id, intituleField.value, filiereSelect.value);
        if(response.id === -500) {
          Swal.fire("Mise à jour groupe", "Erreur de la mise à jour!", "error");
        }
        if(response.id === -400) {
          Swal.showValidationMessage("Veuillez spécifier le nouvel intitulé");
        }
        Swal.fire("Mise à jour groupe", "Intitulé mis à jour!", "success");
        this.groupes = await this.surveillantService.getGroupes();
      }
    })
  }

}
