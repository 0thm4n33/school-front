import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CertificatMedical } from 'src/app/models/certificat-medical.model';

@Component({
  selector: 'app-certificat-medical',
  templateUrl: './certificat-medical.component.html'
})
export class CertificatMedicalComponent implements OnInit {

  @Output() closeCertificatMedical = new EventEmitter<CertificatMedical>();
  certificatMedical: CertificatMedical = {} as CertificatMedical;

  constructor() { }

  ngOnInit(): void {
  }


  close() {
    this.closeCertificatMedical.emit(this.certificatMedical);
  }
}
