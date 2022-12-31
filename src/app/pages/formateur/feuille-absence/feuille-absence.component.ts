import { Component, OnInit } from '@angular/core';
import { Etudiant } from 'src/app/models/etudiant.model';
import { Filiere } from 'src/app/models/filiere.model';
import { Groupe } from 'src/app/models/groupe.model';
import { Niveau } from 'src/app/models/niveau.model';
import { Absence } from 'src/app/models/absence.model';
import { FormateurService } from 'src/app/services/formateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-feuille-absence',
  templateUrl: './feuille-absence.component.html',
  styleUrls: ['./feuille-absence.component.css'],
})
export class FeuilleAbsenceComponent implements OnInit {
  etudiants: Etudiant[] = [];
  niveaux: Niveau[] = [];
  selectedNiveau?: number;
  filieres: Filiere[] = [];
  selectedFiliere?: number;
  groupes: Groupe[] = [];
  selectedGroupe?: number;
  periode: string = '';
  periodeTable: string = '';
  oldEtudiants: Etudiant[] = [];

  constructor(private formateurService: FormateurService) {}

  async ngOnInit(): Promise<void> {
    this.niveaux = await this.formateurService.getAll();
    this.selectedNiveau = this.niveaux[0].id;
    this.loadFilieres();
    this.periode = new Date().toLocaleDateString('en-CA');
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

  async loadEtudiantsInGroupe() {
    let d = new Date(this.periode);
    this.etudiants = await this.formateurService.loadEtudiants(
      this.selectedGroupe as number,
      d.getDate(),
      d.getMonth(),
      d.getFullYear()
    );
    this.oldEtudiants = this.etudiants;
  }

  async updateAbsencesEtudiants() {
    Swal.fire({
      title: "Etes-vous sûr de vouloir valider?",
      text: "L'opération est irréversible",
      inputAttributes: {
        autocapitalize: 'on',
      },
      showCancelButton: true,
      confirmButtonText: 'Valider',
      cancelButtonText: 'Annuler',
      icon: 'question',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.etudiants.map((el) => {
          el.absences[0].periode_1 = Number(el.absences[0].periode_1);
          el.absences[0].periode_2 = Number(el.absences[0].periode_2);
          el.absences[0].periode_3 = Number(el.absences[0].periode_3);
          el.absences[0].periode_4 = Number(el.absences[0].periode_4);
        });
        let updateSucceeded = await this.formateurService.updateAbsencesEtudiants(this.etudiants);
        if (updateSucceeded) {
          Swal.fire({
            title: 'Absence validée',
            icon: 'success',
          });
        } else {
          Swal.fire({
            title: 'Echec de la mise à jour',
            icon: 'error',
          });
        }
      } 
    });
  }

  async reset() {
    await this.loadEtudiantsInGroupe();
  }
}
