import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Person } from '../models/person.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Hobby } from '../models/hobby.model';
import { Occupation } from '../models/occupation.model';
import { PeopleOccupation } from '../models/peopleOccupation.model';
import { editPeopleOccupationDto } from '../models/editPeopleOccupationDto';
  


@Injectable({
  providedIn: 'root'
})
export class DataServerService {

   
  constructor(private http: HttpClient) { }

  //people  
  getPeopleFromServer(sortType: string, pageNumber: number, pageSize: number): Observable<Person[]> {
    const params = '/?sortType=' + sortType + '&pageNumber=' + pageNumber + '&pageSize=' + pageSize
    return this.http.get<Person[]>(environment.URLBASE + 'api/people/getpeople' + params);

  }

  addPeopleToServer(person: Person) {
        
    const params = '/?id='+ person.id + '&name=' + person.name + '&age=' + person.age + '&hobbyDescription=' + person.hobbyDescription +  '&hobbyId=' + person.hobbyId;
    this.http.post(environment.URLBASE + 'api/people/addpeople' + params, {})
      .subscribe();
  }

  editPeopleToServer(person: Person) {
    const params = '/?id='+ person.id + '&name=' + person.name + '&age=' + person.age + '&hobbyDescription=' + person.hobbyDescription +  '&hobbyId=' + person.hobbyId;

    this.http.put(environment.URLBASE + 'api/people/updatepeople' + params, {})
      .subscribe();
  }

  deletePeopleToServer(id: number) {

    this.http.delete(environment.URLBASE + 'api/people/deletepeople?id=' + id)
      .subscribe();
  }

  
//PeopleOccupations

getPeopleOccupationsFromServer(): Observable<PeopleOccupation[]> {
  return this.http.get<PeopleOccupation[]>(environment.URLBASE + 'api/people/getpeopleoccupations');
}

addPeopleOccupationToServer(peopleOccupation: PeopleOccupation){
  const params = '/?occupationId='+ peopleOccupation.occupationId + '&peopleId=' + peopleOccupation.peopleId;

  this.http.post(environment.URLBASE + 'api/people/addpeopleoccupation' + params, {})
    .subscribe();
}

editPeopleOccupationToServer(newPeopleOccupation: PeopleOccupation, oldPeopleOccupation?: PeopleOccupation){

   const editPeopleOccupationDto: editPeopleOccupationDto =  {
    oldOccupationId: oldPeopleOccupation?.occupationId as number,
    oldPeopleId: oldPeopleOccupation?.peopleId as number,
    newOccupationId: newPeopleOccupation.occupationId,
    newPeopleId: newPeopleOccupation.peopleId
  } 
  
  // const params = '/?occupationId='+ newPeopleOccupation.occupationId + '&peopleId=' + newPeopleOccupation.peopleId
  //  + '&occupationId=' + oldPeopleOccupation?.occupationId + '&peopleId=' + oldPeopleOccupation?.peopleId;

   
  this.http.put(environment.URLBASE + 'api/people/updatepeopleoccupation/', editPeopleOccupationDto)
    .subscribe();
}

deletePeopleOccupationToServer(peopleOccupation: PeopleOccupation) {

  const params = '/?occupationId='+ peopleOccupation.occupationId + '&peopleId=' + peopleOccupation.peopleId;
  
  this.http.delete(environment.URLBASE + 'api/people/DeletePeopleOccupation' + params)
    .subscribe();
    
}


  //Hobbies

  getHobbiesFromServer(): Observable<Hobby[]> {
    return this.http.get<Hobby[]>(environment.URLBASE + 'api/hobby/gethobbies');
  }

  addHobbyToServer(hobby: Hobby){
    const params = '/?id='+ hobby.id + '&description=' + hobby.description;

    this.http.post(environment.URLBASE + 'api/hobby/addhobby' + params, {})
      .subscribe();
  }

  editHobbyToServer(hobby: Hobby){
    const params = '/?id='+ hobby.id + '&description=' + hobby.description;

    this.http.put(environment.URLBASE + 'api/hobby/updatehobby' + params, {})
      .subscribe();
  }

  deleteHobbyToServer(id: number): Observable<any> {

    return this.http.delete(environment.URLBASE + 'api/hobby/deletehobby?id=' + id)
      
  }

//Occupations

getOccupationsFromServer(): Observable<Occupation[]> {
  return this.http.get<Occupation[]>(environment.URLBASE + 'api/occupation/getoccupations');
}

addOccupationToServer(occupation: Occupation){
  const params = '/?id='+ occupation.id + '&description=' + occupation.description;

  this.http.post(environment.URLBASE + 'api/occupation/addoccupation' + params, {})
    .subscribe();
}

editOccupationToServer(occupation: Occupation){
  const params = '/?id='+ occupation.id + '&description=' + occupation.description;

  this.http.put(environment.URLBASE + 'api/occupation/updatehobby' + params, {})
    .subscribe();
}

deleteOccupationToServer(id: number): Observable<any> {

  return this.http.delete(environment.URLBASE + 'api/occupation/deleteoccupation?id=' + id)
    
}


}
