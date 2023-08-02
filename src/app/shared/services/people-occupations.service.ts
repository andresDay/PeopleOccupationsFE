import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PeopleOccupation } from '../models/peopleOccupation.model';
import { DataServerService } from './dataserver.service';

@Injectable({
  providedIn: 'root'
})
export class PeopleOccupationsService {

  peopleOccupationsChanged = new Subject<PeopleOccupation[]>();
  // editMode: boolean = false;

  peopleOccupations: PeopleOccupation[] = [];
  
  oldPeopleOccupation?: PeopleOccupation;

  constructor(private dataServerService: DataServerService) { }


  getPeopleOccupations() {
    this.dataServerService.getPeopleOccupationsFromServer().subscribe((res) => {
      this.peopleOccupations = res;
      this.peopleOccupationsChanged.next(this.peopleOccupations.slice());   
    });
  }

  addPeopleOccupation(peopleOccupation: PeopleOccupation) {
    this.dataServerService.addPeopleOccupationToServer(peopleOccupation);

    // peopleOccupation.id = this.peopleOccupations.length + 2;
    this.peopleOccupations.push(peopleOccupation);
    this.peopleOccupationsChanged.next(this.peopleOccupations.slice());
  }


  editPeopleOccupation(newPeopleOccupation: PeopleOccupation) {

    console.log(this.oldPeopleOccupation);
    this.dataServerService.editPeopleOccupationToServer(newPeopleOccupation, this.oldPeopleOccupation);

    const index = this.peopleOccupations.findIndex((elem => elem.occupationId === this.oldPeopleOccupation?.occupationId && elem.peopleId === this.oldPeopleOccupation?.peopleId));
    this.peopleOccupations[index] = newPeopleOccupation;

    this.peopleOccupationsChanged.next(this.peopleOccupations.slice());

  }

  deletePeopleOccupation(peopleOccupation: PeopleOccupation, index: number) {

    this.dataServerService.deletePeopleOccupationToServer(peopleOccupation);

    this.peopleOccupations.splice(index, 1);
    this.peopleOccupationsChanged.next(this.peopleOccupations.slice());
  }

}
