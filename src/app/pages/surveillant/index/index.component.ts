import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BilletAbsence } from 'src/app/models/billet-absence.model';
import { Etudiant } from 'src/app/models/etudiant.model';
import { Filiere } from 'src/app/models/filiere.model';
import { Groupe } from 'src/app/models/groupe.model';
import { Niveau } from 'src/app/models/niveau.model';
import { FormateurService } from 'src/app/services/formateur.service';
import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { CertificatMedical } from 'src/app/models/certificat-medical.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
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
  userIsSelected: boolean = false;
  etudiantSelected: any = null;
  shouldDisplayBilletAbsence: boolean = false;
  shouldDisplayCertificatMedical: boolean = false;
  espace: string = "Surveillant";
  page: string = "Accueil";


  constructor(private formateurService: FormateurService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.niveaux = await this.formateurService.getAll();
    this.selectedNiveau = this.niveaux[0].id;
    this.loadFilieres();
    this.periode = new Date().toLocaleDateString('fr-FR');
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
    console.log(`periode : ${this.periode}`)
    let d = new Date(this.periode);
    let day = this.getDay(d.getUTCDay());
    console.log(`day: ${day}`);
    this.etudiants = await this.formateurService.loadEtudiants(
      this.selectedGroupe as number,
      d.getDate(),
      d.getMonth(),
      d.getFullYear()
    );
    this.calculateCumJour();
    this.oldEtudiants = this.etudiants;
  }

  calculateCumJour(){
    this.etudiants.map(e =>(
      e.absences.map(a =>(
        e.cumJour = a.periode_1 + a.periode_2 + a.periode_3 + a.periode_4
      ))))
  }

  calculateWeek(){
    
  }

  getDay(day: number){
    const days = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
    return days[--day];
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
          el.absences[0].periode_5 = Number(el.absences[0].periode_5);
        });
        let updateSucceeded =
          await this.formateurService.updateAbsencesEtudiants(this.etudiants);
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

  triggerSelection(event: any) {
    // box has just been checked
    this.userIsSelected = event.target.checked;
    let checkboxes: any = document.getElementsByClassName("et");
    if(this.userIsSelected) {
      this.etudiantSelected = this.etudiants.filter(el => el.id == Number(event.target.id))[0];
      console.log(this.etudiantSelected);
      for(let i=0; i<checkboxes.length; i++) {
        if(checkboxes[i].id !== this.etudiantSelected.id.toString()) {
          checkboxes[i].checked = false;
        } else {
          checkboxes[i].checked = true;
        }
      }
    } else {
      this.etudiantSelected = null;
    }
  }

  displayBilletAbsence() {
    this.shouldDisplayCertificatMedical = false;
    this.shouldDisplayBilletAbsence = true;
    this.page = "Billet d'absence";
  }

  displayCertificatMedical() {
    this.shouldDisplayBilletAbsence = false;
    this.shouldDisplayCertificatMedical = true;
    this.page = "Certificat medical";
  }

  closeBilletAbsence(billetAbsence: BilletAbsence) {
    this.page = "Accueil";
    this.shouldDisplayCertificatMedical = false;
    this.shouldDisplayBilletAbsence = false;
  }

  closeCertificatMedical(certificatMedical: CertificatMedical) {
    this.page = "Accueil";
    this.shouldDisplayCertificatMedical = false;
    this.shouldDisplayBilletAbsence = false;
  }

}
