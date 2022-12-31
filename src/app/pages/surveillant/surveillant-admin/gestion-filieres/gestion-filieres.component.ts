import { Component, OnInit } from '@angular/core';
import { Filiere } from 'src/app/models/filiere.model';
import { Groupe } from 'src/app/models/groupe.model';
import { Niveau } from 'src/app/models/niveau.model';
import { SurveillantService } from 'src/app/services/surveillant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-filieres',
  templateUrl: './gestion-filieres.component.html',
  styleUrls: ['./gestion-filieres.component.css']
})
export class GestionFilieresComponent implements OnInit {

  constructor(private surveillantService: SurveillantService) { }

  intitule: string = "";
  code: string = "";
  niveaux: Niveau[] = [];
  error: string = "";
  filieres: Filiere[] = [];
  niveauId: number = 0;

  async ngOnInit() {
    this.niveaux = await this.surveillantService.getNiveaux();
    this.niveauId = this.niveaux[0].id;
    this.filieres = await this.surveillantService.getFilieres();
    console.log(this.filieres[0]);
    this.error = "";
  }

  async createFiliere() {
    this.error = ""
    if(this.intitule === "") {
      this.error = "Veuillez spécifier l'intitulé";
      return;
    }
    if(this.code === "") {
      this.error = "Veuillez spécifier le code";
      return;
    }
    let response = await this.surveillantService.createFiliere(this.intitule, this.niveauId, this.code);
    if(response === 201) {
      Swal.fire("Création filière", "Filière créée!", "success");
      this.filieres = await this.surveillantService.getFilieres();
      this.code = "";
      this.intitule = "";  
      return;
    }
    if(response === 400) {
      this.error = "Veuillez spécifier l'intitulé et le code";
      return;
    }
    if(response === 409) {
      Swal.fire("Création filière", "Une filière avec le meme intitulé existe déjà", "error");
      return;
    }
    if(response === 500) {
      Swal.fire("Création filière", "Erreur serveur", "success");
    }
  }

  async modifyFiliere(event: any) {
    let id = event.target.id.split("-")[1];
    let f = this.filieres.find(el => el.id == id);
    Swal.fire({
      title: `Modifier filière : ${f?.normalizedIntitule}`,
      width: '600px',
      html: `
        <div>
          <div class='form-group'>
            <label class='form-label'>Nouvel intitulé</label>
            <input class='form-control' id='newIntitule'>
          </div>
          <div class='form-group'>
            <label class='form-label'>Nouvel code</label>
            <input class='form-control' id='newCode'>
          </div>
          <div class='form-group'>
            <label class='form-label'>Nouvel niveau</label>
            <select class='form-select' id='newNiveau'></select>
          </div>
        </div>
      `,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Mettre à jour',
      cancelButtonText: 'Annuler',
      icon: 'question',
      didOpen: () => {
        let niveauSelect : any = document.getElementById("newNiveau");
        this.niveaux.forEach(el => {
          niveauSelect.innerHTML+= `
            <option value="${el.id}">${el.normalizedIntitule}</option>
          `
        })
      },
      preConfirm: async () => {
        let intituleField: any = document.getElementById("newIntitule");
        let codeField: any = document.getElementById("newCode");
        let niveauSelect: any = document.getElementById("newNiveau");
        if(intituleField.value === undefined || intituleField.value === "") {
          Swal.showValidationMessage("Veuillez spécifier le nouvel intitulé");
        }
        if(codeField.value === undefined || codeField.value === "") {
          Swal.showValidationMessage("Veuillez spécifier le nouvel code");
        }
        let response = await this.surveillantService.updateFiliere(id, intituleField.value, codeField.value, niveauSelect.value);
        alert(response.id);
        if(response.id === -500) {
          Swal.fire("Mise à jour groupe", "Erreur de la mise à jour!", "error");
        }
        if(response.id === -409) {
          Swal.showValidationMessage("Intitulé/code déjà utilisé");
        }
        Swal.fire("Mise à jour groupe", "Intitulé mis à jour!", "success");
        this.filieres = await this.surveillantService.getFilieres();
      }
    })
  }

  async deleteFiliere(event: any) {
    Swal.fire({
      title: "Suppression filière",
      text: "La suppression de la filière supprime les groupes et les étudiants associés.",
      cancelButtonText: "Annuler",
      confirmButtonText: "Supprimer",
      showCancelButton: true,
      showConfirmButton: true,
      icon: "warning",
      preConfirm: async (confirmDelete) => {
        if(confirmDelete) {
          let id = event.target.id.split("-")[1];
          let deleted = await this.surveillantService.deleteObject("filiere", id);
          if(deleted === true) {
            Swal.fire("Suppression filière", "Filière supprimée!", "success");
            this.niveaux = await this.surveillantService.getNiveaux();
          } else {
            Swal.fire("Suppression filière", "Erreur de suppression", "error");
          }
        }
      } 
    });
  }

}
