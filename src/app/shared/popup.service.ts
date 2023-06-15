import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Person } from './person.model';
import { PersonPopUpComponent } from './person-pop-up/person-pop-up.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  constructor(private personModalRef: MatDialog) { }

  personId: number = 0;
  personAddedOrModified = new Subject<Person>();
  

  openPersonPopUp(person: Person | undefined) {

    if(person){ // si es edit

      this.personId = person.id;
  
      this.personModalRef.open(PersonPopUpComponent, {
        width: '600px',
        height: '300px',
        position: { top: '100px' },
        disableClose: true,
        data: {
          name: person.name,
          occupation: person.occupation,
        }
      });
    }

    else{ //si es add
      this.personId = 0;
      this.personModalRef.open(PersonPopUpComponent, {
        width: '600px',
        height: '300px',
        position: { top: '100px' },
        disableClose: true,        
      });
    }
  }

  closeAllModals() {
    this.personModalRef.closeAll();
  }


  sendPersonToPeopleService(person: Person) {
    this.personAddedOrModified.next(person);
    this.closeAllModals();
  }

}
