import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Person } from './person.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataServerService {

  constructor(private http: HttpClient) { }

  getPeopleFromServer(): Observable<Person[]> {
    return this.http.get<Person[]>(environment.URLBASE + 'api/people/getpeople');

  }
  addPeopleToServer(person: Person) {
    this.http.post(environment.URLBASE + 'api/people/addpeople', person)
      .subscribe();
  }

  editPeopleToServer(person: Person){
    this.http.put(environment.URLBASE + 'api/people/updatepeople', person)
    .subscribe();
  }
  
  deletePeopleToServer(id: number){

    this.http.delete(environment.URLBASE + 'api/people/deletepeople?id='+ id)
    .subscribe();
  }

}
