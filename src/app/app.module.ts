import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { FeuilleAbsenceComponent } from './pages/formateur/feuille-absence/feuille-absence.component';
import { HeaderComponent } from './components/header/header.component';
import { CertificatMedicalComponent } from './pages/surveillant/certificat-medical/certificat-medical.component';
import { BilletAbsenceComponent } from './pages/surveillant/billet-absence/billet-absence.component';
import { IndexComponent } from './pages/surveillant/index/index.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DataTablesModule } from 'angular-datatables';
import { ProfilComponent } from './pages/profil/profil.component';
import { SurveillantAdminComponent } from './pages/surveillant/surveillant-admin/surveillant-admin.component';
import { GestionNiveauxComponent } from './pages/surveillant/surveillant-admin/gestion-niveaux/gestion-niveaux.component';
import { GestionFilieresComponent } from './pages/surveillant/surveillant-admin/gestion-filieres/gestion-filieres.component';
import { GestionGroupesComponent } from './pages/surveillant/surveillant-admin/gestion-groupes/gestion-groupes.component';
import { GestionEtudiantsComponent } from './pages/surveillant/surveillant-admin/gestion-etudiants/gestion-etudiants.component';
import { BilletsComponent } from './pages/formateur/billets/billets.component';
import { AddUserComponent } from './pages/admin/add-user/add-user/add-user.component';
import { ListUsersComponent } from './pages/admin/list-users/list-users.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    FooterComponent,
    ForbiddenComponent,
    FeuilleAbsenceComponent,
    HeaderComponent,
    CertificatMedicalComponent,
    BilletAbsenceComponent,
    IndexComponent,
    BreadcrumbsComponent,
    NotFoundComponent,
    ProfilComponent,
    SurveillantAdminComponent,
    GestionNiveauxComponent,
    GestionFilieresComponent,
    GestionGroupesComponent,
    GestionEtudiantsComponent,
    BilletsComponent,
    AddUserComponent,
    ListUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DataTablesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
