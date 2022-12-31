import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BilletAbsenceComponent } from './pages/surveillant/billet-absence/billet-absence.component';
import { CertificatMedicalComponent } from './pages/surveillant/certificat-medical/certificat-medical.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthRouteGuard } from './guards/auth-route.guard';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { FeuilleAbsenceComponent } from './pages/formateur/feuille-absence/feuille-absence.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RegisterComponent } from './pages/register/register.component';
import { IndexComponent } from './pages/surveillant/index/index.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { SurveillantAdminComponent } from './pages/surveillant/surveillant-admin/surveillant-admin.component';
import { GestionNiveauxComponent } from './pages/surveillant/surveillant-admin/gestion-niveaux/gestion-niveaux.component';
import { GestionFilieresComponent } from './pages/surveillant/surveillant-admin/gestion-filieres/gestion-filieres.component';
import { GestionGroupesComponent } from './pages/surveillant/surveillant-admin/gestion-groupes/gestion-groupes.component';
import { GestionEtudiantsComponent } from './pages/surveillant/surveillant-admin/gestion-etudiants/gestion-etudiants.component';
import { BilletsComponent } from './pages/formateur/billets/billets.component';

const routes: Routes = [
  { path: '', redirectTo: '/connexion', pathMatch: 'full'},
  { path: 'inscription', component: RegisterComponent },
  { path: 'connexion', component: LoginComponent },
  {
    path: 'private',
    component: FooterComponent,
    canActivate: [AuthRouteGuard],
    data: { role: 'ROLE_FORMATEUR' },
    pathMatch: 'full'
  },
  { path: 'forbidden', component: ForbiddenComponent },
  {
    path: 'feuille-absence',
    component: FeuilleAbsenceComponent,
    canActivate: [AuthRouteGuard],
    data: { role: 'ROLE_FORMATEUR' },
    pathMatch: 'full'
  },
  {
    path: 'surveillant',
    component: IndexComponent,
    canActivate: [AuthRouteGuard],
    data: { role: 'ROLE_SURVEILLANT' },
    pathMatch: 'full'
  },
  {
    path: 'profil',
    component: ProfilComponent,
    canActivate: [AuthRouteGuard],
    pathMatch: 'full',
  },
  {
    path: 'surveillant-admin',
    component: SurveillantAdminComponent,
    pathMatch: 'prefix',
    canActivate: [AuthRouteGuard],
    data: { role: 'ROLE_SURVEILLANT'},
    children: [
      {path: 'gestion-niveaux', component: GestionNiveauxComponent},
      {path: 'gestion-filieres', pathMatch:'full' , component: GestionFilieresComponent},
      {path: 'gestion-groupes', pathMatch:'full' , component: GestionGroupesComponent},
      {path: 'gestion-etudiants', pathMatch:'full' , component: GestionEtudiantsComponent},
    ]
  },
  {
    path: 'billets',
    component: BilletsComponent,
    canActivate: [AuthRouteGuard],
    data: { role: 'ROLE_FORMATEUR'}
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
