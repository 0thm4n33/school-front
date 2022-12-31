import { sanitizeIdentifier } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { BilletAbsence } from 'src/app/models/billet-absence.model';
import { Etudiant } from 'src/app/models/etudiant.model';
import { Filiere } from 'src/app/models/filiere.model';
import { Groupe } from 'src/app/models/groupe.model';
import { User } from 'src/app/models/user.model';
import { FormateurService } from 'src/app/services/formateur.service';
import { SurveillantService } from 'src/app/services/surveillant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-billet-absence',
  templateUrl: './billet-absence.component.html'
})
export class BilletAbsenceComponent implements OnInit {

  billetAbsence: BilletAbsence = {} as BilletAbsence;

  @Input() etudiant: Etudiant = {} as Etudiant;
  @Input() groupeId: number | undefined;
  @Input() filiereId: number | undefined;
  surveillantId: string = "";
  surveillant: User = {} as User;
  groupe: Groupe| undefined;
  filiere: Filiere | undefined;
  formateurs: User[] = [];
  errors: string[] = [];
  

  @Output() closeBilletAbsence = new EventEmitter<BilletAbsence>();

  constructor(private surveillantService: SurveillantService, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.surveillantId = localStorage.getItem("id") as string;
    await this.getSurveillantFromId()
  }

  close() {
    this.closeBilletAbsence.emit(this.billetAbsence);
  }

  async getSurveillantFromId() {
    this.surveillant = await this.surveillantService.findById(this.surveillantId);
    this.groupe = await this.surveillantService.findGroupeById(this.groupeId as number);
    this.filiere = await this.surveillantService.findFiliereById(this.filiereId as number);
    this.formateurs = await this.surveillantService.findByRole("ROLE_FORMATEUR");
  }

  async createBilletAbsence() {
    this.errors = [];
    let fieldFormateur: any = document.getElementById("formateur");
    let fieldMotif: any = document.getElementById("motif");
    this.billetAbsence.etudiantId = this.etudiant.id;
    this.billetAbsence.surveillantId = this.surveillantId;
    this.billetAbsence.formateurId = fieldFormateur.value;
    this.billetAbsence.motif = fieldMotif.value;
    let response = await this.surveillantService.createBilletAbsence(this.billetAbsence);
    switch(response.status) {
      case 201:
        
        Swal.fire({
          title: "Création billte d'absence",
          icon: "success",
          text: "Billet d'absence créé!",
          showConfirmButton: true,
          confirmButtonText: "Fermer",
          preConfirm: () => {
            window.location.href = "/surveillant";
          }
        });
        break;
      case 400:
        let { errors } = await response.json();
        this.errors = errors;
        console.log(this.errors);
        break;
      default:
        Swal.fire("Création billet d'absence", "Erreur serveur!", "error");
        break;
    }
    
  }

}
