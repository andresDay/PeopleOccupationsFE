import { Injectable } from '@angular/core';
import { Person } from '../models/person.model';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DataServerService } from './dataserver.service';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  peopleChanged = new Subject<Person[]>();
  // editMode: boolean = false;

  persons: Person[] = [];
  // persons: Person[] =[
  //   new Person(1,"Juan","Carpintero"),
  //   new Person(2, "Pedro", "Plomero"),
  //   new Person(3, "Pablito", "Médico"),
  //   new Person(4, "Juana", "Médico"),
  // ];

  constructor(private dataServerService: DataServerService) { }


  getPeople() {
    this.dataServerService.getPeopleFromServer().subscribe((res) => {
      this.persons = res;
      this.peopleChanged.next(this.persons.slice());   
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
    this.peopleChanged.next(this.persons.slice());
  }

}
