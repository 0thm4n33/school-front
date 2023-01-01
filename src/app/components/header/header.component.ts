import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BilletAbsence } from 'src/app/models/billet-absence.model';
import { AuthService } from 'src/app/services/auth.service';
import { FormateurService } from 'src/app/services/formateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isSurveillant: boolean = false;
  isFormateur: boolean = false;
  matricule: string = '';
  espace: string = '';
  page: string = '';
  displayUserNav: boolean = false;
  isAuthPage: boolean = false;
  showBilletsNotification: boolean = false;
  billetsCount: number = 0;
  constructor(private authService: AuthService, private formateurService: FormateurService) {}

  ngOnInit(): void {
    let userRole = localStorage.getItem('role');
    let tmp = window.location.toString().split("/");
    let currentUrl = tmp[tmp.length -1];
    if(currentUrl === "connexion" || currentUrl === "inscription") {
      this.isAuthPage = true;
    } else {
      this.isAuthPage = false;
    }

    if (userRole === 'ROLE_SURVEILLANT' || userRole === 'ROLE_ADMIN') {
      this.isSurveillant = true;
      this.isFormateur = false;
      this.espace = 'Surveillant';
      this.displayUserNav = true;
    }
    if (userRole === 'ROLE_FORMATEUR') {
      setInterval(async () => await this.pollServerForBillets(), 2000);
      this.isSurveillant = false;
      this.isFormateur = true;
      this.espace = 'Formateur';
      this.displayUserNav = true;
    }
    this.matricule = localStorage.getItem('matricule') as string;
    this.page = localStorage.getItem('page') as string;
  }

  async logout() {
    await this.authService.logout();
  }

  async pollServerForBillets() {
    let billets: BilletAbsence[] = await this.formateurService.getBillets(localStorage.getItem("id") as string);
    if(billets.length > 0) {
      this.billetsCount = billets.length;
    }
  }
}
