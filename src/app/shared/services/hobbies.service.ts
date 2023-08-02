import { Injectable } from '@angular/core';
import { DataServerService } from './dataserver.service';
import { Hobby } from '../models/hobby.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HobbiesService {

  constructor(private dataServerService: DataServerService) { }

  hobbiesChanged = new Subject<Hobby[]>();
  hobbies: Hobby[] = [];

  
  getHobbies(){
    this.dataServerService.getHobbiesFromServer().subscribe((res)=> {
      this.hobbies = res;
      this.hobbiesChanged.next(this.hobbies.slice());

    })
  }

  
  addHobby(hobby: Hobby) {
    
    this.dataServerService.addHobbyToServer(hobby);
    hobby.id = this.hobbies.length + 2;

    this.hobbies.push(hobby);
    this.hobbiesChanged.next(this.hobbies.slice());
  }


  editHobby(hobby: Hobby) {

    this.dataServerService.editHobbyToServer(hobby);

    const index = this.hobbies.findIndex((elem => elem.id === hobby.id));
    this.hobbies[index] = hobby;

    this.hobbiesChanged.next(this.hobbies.slice());

  }

  deleteHobby(id: number, index: number) {

    this.dataServerService.deleteHobbyToServer(id).subscribe((res) =>{

      this.hobbies.splice(index, 1);
      this.hobbiesChanged.next(this.hobbies.slice());

    }, (error) => {

      alert('FK Restriction');
    }
    );


  }

}
