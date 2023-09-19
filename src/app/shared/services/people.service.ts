import { Injectable } from '@angular/core';
import { Person } from '../models/person.model';
import { Observable, Subject, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DataServerService } from './dataserver.service';
import { PeopleFilterArgs } from '../models/Filter/peopleFilterArgs';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  
  peopleChanged = new Subject<Person[]>();  
  getNoRecords = new Subject<string>();
  persons: Person[] = [];

  peopleCount:number = 0;
  

  constructor(private dataServerService: DataServerService) { }
  
  getPeople(personFilterArgs: PeopleFilterArgs) {
    
    this.dataServerService.getPeopleFromServer(personFilterArgs)    
        
    .subscribe((res) => {
      this.peopleCount = res.totalCount;
      this.persons = res.peopleModels;
      this.peopleChanged.next(this.persons.slice());   
    }, error => {
      this.persons = [];
      this.getNoRecords.next("No Records");
    });
  }


  addPerson(person: Person) {
    this.dataServerService.addPeopleToServer(person);

    person.id = this.persons.length + 2;
    this.persons.push(person);
    this.peopleChanged.next(this.persons.slice());
  }


  editPerson(person: Person) {

    this.dataServerService.editPeopleToServer(person);

    const index = this.persons.findIndex((elem => elem.id === person.id));
    this.persons[index] = person;

    this.peopleChanged.next(this.persons.slice());

  }

  deletePerson(id: number, index: number) {

    this.dataServerService.deletePeopleToServer(id);
    this.persons.splice(index, 1);
    this.peopleCount--;
    this.peopleChanged.next(this.persons.slice());
  }

}
