import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { MatIconModule } from '@angular/material/icon';
import {  HttpClientModule } from '@angular/common/http';
import { PersonPopUpComponent } from './shared/pop-ups/person-pop-up/person-pop-up.component';
import { MatDialogModule } from '@angular/material/dialog'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OccupationListComponent } from './occupation-list/occupation-list.component';
import { HobbiesListComponent } from './hobbies-list/hobbies-list.component';
import { PeopleOccupationListComponent } from './people-occupation-list/people-occupation-list.component';
import { HobbyPopUpComponent } from './shared/pop-ups/hobby-pop-up/hobby-pop-up.component';
import { OccupationPopUpComponent } from './shared/pop-ups/occupation-pop-up/occupation-pop-up.component';
import { PeopleOccupationPopUpComponent } from './shared/pop-ups/people-occupation-pop-up/people-occupation-pop-up.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    PersonPopUpComponent,
    OccupationListComponent,
    HobbiesListComponent,
    PeopleOccupationListComponent,
    HobbyPopUpComponent,
    OccupationPopUpComponent,
    PeopleOccupationPopUpComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    HttpClientModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
