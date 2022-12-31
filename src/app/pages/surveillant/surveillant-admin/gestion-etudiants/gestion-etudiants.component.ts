import { Component, OnInit } from '@angular/core';
import { Etudiant } from 'src/app/models/etudiant.model';
import { Filiere } from 'src/app/models/filiere.model';
import { Groupe } from 'src/app/models/groupe.model';
import { Niveau } from 'src/app/models/niveau.model';
import { FormateurService } from 'src/app/services/formateur.service';
import { SurveillantService } from 'src/app/services/surveillant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-etudiants',
  templateUrl: './gestion-etudiants.component.html',
  styleUrls: ['./gestion-etudiants.component.css']
})
export class GestionEtudiantsComponent implements OnInit {
  

  constructor(private surveillantService: SurveillantService) { }

  etudiants: Etudiant[] = [];
  isAddMode: boolean = false;
  niveaux: Niveau[] = [];
  filieres: Filiere[] = [];
  groupes: Groupe[] = [];
  etudiant: Etudiant = {} as Etudiant;
  selectedFiliere: number = 0;
  selectedNiveau: number = 0;
  selectedGroupe: number = 0;
  validationErrors: string[] = [];
  modifyMode: boolean = false;


  async annuler() {
    await this.triggerAddEtudiant();
    this.modifyMode = false;
  }


  async triggerAddEtudiant() {
   this.isAddMode = !this.isAddMode;
   this.etudiant = {} as Etudiant;
   this.validationErrors = [];
  }
  async createEtudiant() {
    this.validationErrors = [];
    this.etudiant.niveauId = this.selectedNiveau;
    this.etudiant.filiereId = this.selectedFiliere;
    this.etudiant.groupeId = this.selectedGroupe;
    
    let response: Etudiant = await this.surveillantService.createEtudiant(this.etudiant);
    if(response.validationErrors === undefined || response.validationErrors.length === 0 || response.id > 0)
    {
      this.etudiants = await this.surveillantService.getEtudiants();
      this.triggerAddEtudiant();
      Swal.fire("Création étudiant", "Etudiant créé!", "success");
    } else {
      this.validationErrors = response.validationErrors;
    }
  }

  async deleteEtudiant(event:any) {
    let id = event.target.id.split("-")[1];
    Swal.fire({
      title: "Suppression étudiant",
      text: "La suppression de l'étudiant supprime les absences et les certificats médicaux associés.",
      cancelButtonText: "Annuler",
      confirmButtonText: "Supprimer",
      showCancelButton: true,
      showConfirmButton: true,
      icon: "warning",
      preConfirm: async (confirmDelete) => {
        if(confirmDelete) {
          let id = event.target.id.split("-")[1];
          let deleted = await this.surveillantService.deleteObject("etudiant", id);
          if(deleted === true) {
            Swal.fire("Suppression étudiant", "Etudiant supprimé!", "success");
            this.etudiants = await this.surveillantService.getEtudiants();
          } else {
            Swal.fire("Suppression étudiant", "Erreur de suppression", "error");
          }
        }
      } 
    });
  }

  async ngOnInit(): Promise<void> {
    this.validationErrors = [];
    this.isAddMode = false;
    this.etudiants = await this.surveillantService.getEtudiants(); 
    this.niveaux = await this.surveillantService.getNiveaux();
    this.selectedNiveau = this.niveaux[0].id;
    this.loadFilieres();
  }

  loadFilieres() {
    this.filieres = this.niveaux.filter((el) => el.id == this.selectedNiveau)[0]
      .filieres as Filiere[];
    this.selectedFiliere = this.filieres[0].id;
    this.loadGroupes();
  }

  loadGroupes() {
    this.groupes = this.filieres.filter(
      (el) => el.id == this.selectedFiliere
    )[0].groupes as Groupe[];
    this.selectedGroupe = this.groupes[0].id;
  }

  async modifyEtudiant(event: any) {
    this.modifyMode = true;
    let id = event.target.id.split("-")[1];
    this.triggerAddEtudiant();
    let etudiant = this.etudiants.filter(el => el.id == id)[0];
    this.etudiant = etudiant;
    this.selectedNiveau = this.etudiant.niveauId;
  }

  async displayEtudiant(event: any) {
    this.modifyMode = true;
    let id = event.target.id.split("-")[1];
    let etudiant = this.etudiants.filter(el => el.id == id)[0];
    Swal.fire({
      title: `${etudiant.nom} ${etudiant.prenom.toUpperCase()}`,
      width: "700px",
      customClass: {
        title: "d-flex align-self-center mb-2",
        htmlContainer: "float-left",
        inputLabel: "bg-danger"
      },
      scrollbarPadding: false,
      confirmButtonText: "Fermer",
      showConfirmButton: false,
      html: `
        <div class="d-flex gap-4 flex-column">
          <div class="row">
            <div class="form-group col">
              <label class=" pb-2 fw-bold d-block" style="text-align:left">CIN</label>
              <input value="${etudiant.cin}" disabled class="form-control bg-white text-center"/>
            </div>
            <div class="form-group col">
              <label class=" pb-2 fw-bold d-block" style="text-align:left">Code</label>
              <input value="${etudiant.code}" disabled class="form-control bg-white text-center"/>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class=" pb-2 fw-bold d-block" style="text-align:left">Adresse</label>
              <input value="${etudiant.adresse}" disabled class="form-control bg-white text-center"/>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class=" pb-2 fw-bold d-block"style="text-align:left">Tel</label>
              <input value="${etudiant.tel}" disabled class="form-control bg-white text-center"/>
            </div>
            <div class="form-group col">
              <label class=" pb-2 fw-bold d-block" style="text-align:left">Niveau</label>
              <input value="${etudiant.niveauIntitule}" disabled class="form-control bg-white text-center"/>
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label class=" pb-2 fw-bold d-block" style="text-align:left">Fillière</label>
              <input value="${etudiant.filiereIntitule}" disabled class="form-control bg-white text-center"/>
            </div>
            <div class="form-group col">
              <label class=" pb-2 fw-bold d-block" style="text-align:left">Groupe</label>
              <input value="${etudiant.groupeIntitule}" disabled class="form-control bg-white text-center"/>
            </div>
          </div>
        </div>
      `
    })
  }

}
