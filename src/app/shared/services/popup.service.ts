import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Person } from '../models/person.model';
import { PersonPopUpComponent } from '../pop-ups/person-pop-up/person-pop-up.component';
import { PeopleService } from './people.service';
import { Hobby } from '../models/hobby.model';
import { HobbyPopUpComponent } from '../pop-ups/hobby-pop-up/hobby-pop-up.component';
import { Occupation } from '../models/occupation.model';
import { OccupationPopUpComponent } from '../pop-ups/occupation-pop-up/occupation-pop-up.component';
import { PeopleOccupation } from '../models/peopleOccupation.model';
import { PeopleOccupationPopUpComponent } from '../pop-ups/people-occupation-pop-up/people-occupation-pop-up.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  constructor(private personModalRef: MatDialog, private peopleService: PeopleService) { }

  personId: number = 0;
  hobbyId: number = 0;
  occupationId: number = 0;

  personAddedOrModified = new Subject<Person>();
  hobbyAddedOrModified = new Subject<Hobby>();
  occupationsAddedOrModified = new Subject<Occupation>();
  peopleOccupationsAddedOrModified = new Subject<PeopleOccupation>();

  dataToPopUp: any;  

  openPersonPopUp(person: Person | undefined) {

    if (person) { // if edit
      this.dataToPopUp = person;
      
      this.personId = person.id;

    } else { //if add
      this.dataToPopUp = undefined;
      this.personId = 0;      
    }

    this.personModalRef.open(PersonPopUpComponent, {
      width: '800px',
      height: '500px',
      position: { top: '100px' },
      disableClose: true,
      data: this.dataToPopUp,
    });    

  }

  openHobbyPopUp(hobby: Hobby | undefined) {

    if (hobby) { // if edit
      this.dataToPopUp = hobby;
    
      this.hobbyId = hobby.id;

    } else { //if add
      this.dataToPopUp = undefined;
      this.hobbyId = 0;      
    }

    this.personModalRef.open(HobbyPopUpComponent, {
      width: '800px',
      height: '500px',
      position: { top: '100px' },
      disableClose: true,
      data: this.dataToPopUp,
    });    

  }

  openOccupationPopUp(occupation: Occupation | undefined) {

    if (occupation) { // if edit
      this.dataToPopUp = occupation;
    
      this.occupationId = occupation.id;

    } else { //if add
      this.dataToPopUp = undefined;
      this.occupationId = 0;      
    }

    this.personModalRef.open(OccupationPopUpComponent, {
      width: '800px',
      height: '500px',
      position: { top: '100px' },
      disableClose: true,
      data: this.dataToPopUp,
    });    

  }

  openPeopleOccupationPopUp(peopleOccupation: PeopleOccupation | undefined) {

    if (peopleOccupation) { // if edit
      this.dataToPopUp = peopleOccupation;
      this.occupationId = peopleOccupation.occupationId;
      this.personId = peopleOccupation.peopleId;
      
    } else { //if add
      this.dataToPopUp = undefined;
      this.occupationId = 0;      
      this.personId = 0;
    }

    this.personModalRef.open(PeopleOccupationPopUpComponent, {
      width: '800px',
      height: '500px',
      position: { top: '100px' },
      disableClose: true,
      data: this.dataToPopUp,
    });    

  }


  closeAllModals() {
    this.personModalRef.closeAll();
  }

  sendPersonToPeopleService(person: Person) {
    this.personAddedOrModified.next(person);
    this.closeAllModals();
  }

  sendHobbyToHobbiesService(hobby: Hobby){
    this.hobbyAddedOrModified.next(hobby);
    this.closeAllModals();
  }

  sendOccupationToOccupationsService(occupation: Occupation){
    this.occupationsAddedOrModified.next(occupation);
    this.closeAllModals();
  }

  sendPeopleOccupationToPeopleOccupationsService(peopleOccupation: PeopleOccupation){
    this.peopleOccupationsAddedOrModified.next(peopleOccupation);
    this.closeAllModals();
  }

}
