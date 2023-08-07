import { AnnulationComponent } from './component/annulation/annulation.component'; // Assurez-vous de mettre le bon chemin vers votre composant AnnulationComponent
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { NgModule } from '@angular/core';


const routes: Routes = [
  { path: '', component: HomeComponent }, // Utilisez HomeComponent comme page d'accueil
  { path: 'home', component: HomeComponent }, // Utilisez HomeComponent comme page d'accueil
  { path: 'annulation/:id', component: AnnulationComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
