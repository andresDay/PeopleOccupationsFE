import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OccupationListComponent } from './occupation-list/occupation-list.component';
import { HobbiesListComponent } from './hobbies-list/hobbies-list.component';
import { PeopleOccupationListComponent } from './people-occupation-list/people-occupation-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/peopleList', pathMatch: 'full' },
  { path: 'peopleList', component: HomeComponent },
  { path: 'occupationList', component: OccupationListComponent },
  { path: 'hobbiesList', component: HobbiesListComponent },
  { path: 'peopleOccupationList', component: PeopleOccupationListComponent },
  { path: '**', redirectTo: '/peopleList' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
