import { Component, OnInit } from '@angular/core';
import { Niveau } from 'src/app/models/niveau.model';
import { SurveillantService } from 'src/app/services/surveillant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-niveaux',
  templateUrl: './gestion-niveaux.component.html',
  styleUrls: ['./gestion-niveaux.component.css']
})
export class GestionNiveauxComponent implements OnInit {

  constructor(private surveillantService: SurveillantService) { }

  intitule: string = "";
  error: string = "";
  niveaux: Niveau[] = [];

  async ngOnInit() {
    this.intitule = "";
    this.error = "";
    this.niveaux = await this.surveillantService.getNiveaux();
  }

  async createNiveau() {
    this.error = "";
    if(this.intitule !== null) {
      let niveau: Niveau = await this.surveillantService.createNiveau(this.intitule);
      switch(niveau.id) {
        case -400:
          this.error = "Veuillez spécifier l'intitulé du niveau";
          break;
        case -409:
          Swal.fire("Création niveau", "Intitulé déjà utilisé, veuillez choisir un autre intitulé", "error");
          break;
        case 500:
          Swal.fire("Création niveau", "Erreur serveur", "error");
          break;
        default:
          Swal.fire("Création niveau", "Niveau créé!", "success");
          this.niveaux = await this.surveillantService.getNiveaux();
      }
    } else {
      this.error = "Veuillez spécifier l'intitulé du niveau";
    }
  }

  async deleteNiveau(event: any) {
    Swal.fire({
      title: "Suppression niveau",
      text: "La suppression du niveau supprime les filières, les groupes, et les étudiants associés.",
      cancelButtonText: "Annuler",
      confirmButtonText: "Supprimer",
      showCancelButton: true,
      showConfirmButton: true,
      icon: "warning",
      preConfirm: async (confirmDelete) => {
        if(confirmDelete) {
          let id = event.target.id.split("-")[1];
          let deleted = await this.surveillantService.deleteObject("niveau", id);
          if(deleted === true) {
            Swal.fire("Suppression niveau", "Niveau supprimé!", "success");
            this.niveaux = await this.surveillantService.getNiveaux();
          } else {
            Swal.fire("Suppression niveau", "Erreur de suppression", "error");
          }
        }
      } 
    });
  }

  async modifyNiveau(event: any) {
    let id = event.target.id.split("-")[1];
    let n = this.niveaux.find(el => el.id == id);
    Swal.fire({
      title: `Modifier niveau : ${n?.normalizedIntitule}`,
      html: `
        <div>
          <div class='form-group'>
            <input id='newIntitule' class='form-control' placeholder='Nouvel intitulé' />
          </div>
        </div>
      `,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Mettre à jour',
      cancelButtonText: 'Annuler',
      icon: 'question',
      preConfirm: async () => {
        let field: any = document.getElementById("newIntitule");
        if(field.value === "") {
          Swal.showValidationMessage("Veuillez spécifier le nouvel intitulé");
        }
        let response = await this.surveillantService.updateNiveau(id, field.value);
        if(response.id === -500) {
          Swal.fire("Mise à jour niveau", "Erreur de la mise à jour!", "error");
        }
        if(response.id === -400) {
          Swal.showValidationMessage("Veuillez spécifier le nouvel intitulé");
        }
        Swal.fire("Mise à jour niveau", "Intitulé mis à jour!", "success");
        this.niveaux = await this.surveillantService.getNiveaux();
      }
    })
  }

}
