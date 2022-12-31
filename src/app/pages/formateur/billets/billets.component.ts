import { Component, OnInit } from '@angular/core';
import { BilletAbsence } from 'src/app/models/billet-absence.model';
import { FormateurService } from 'src/app/services/formateur.service';
import { SurveillantService } from 'src/app/services/surveillant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-billets',
  templateUrl: './billets.component.html',
  styleUrls: ['./billets.component.css']
})
export class BilletsComponent implements OnInit {

  today: string = "";
  billets: BilletAbsence[] = [];

  constructor(private surveillantService: SurveillantService, private formateurService: FormateurService) { }

  async ngOnInit() {
    let date = new Date();
    this.today = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
    this.billets = await this.formateurService.getBillets(localStorage.getItem("id") as string);
  }

  async validateBillet(event: any) {
    let billetId = event.target.id.split("-")[1];
    let success = await this.formateurService.validateBilletAbsence(billetId);
    if(success === true) {
      this.billets = await this.formateurService.getBillets(localStorage.getItem("id") as string);
      Swal.fire("Validation billet", "Billet validé!", "success");
    } else {
      Swal.fire("Validation billet", "Erreur de validation du billet d'absence", "error");
    }
  }

  

}
