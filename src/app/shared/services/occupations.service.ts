import { Injectable } from '@angular/core';
import { DataServerService } from './dataserver.service';
import { Subject } from 'rxjs';
import { Occupation } from '../models/occupation.model';

@Injectable({
  providedIn: 'root'
})
export class OccupationsService {

  constructor(private dataServerService: DataServerService) { }

  occupationsChanged = new Subject<Occupation[]>();
  occupations: Occupation[] = [];

  
  getOccupations(){
    this.dataServerService.getOccupationsFromServer().subscribe((res)=> {
      this.occupations = res;
      this.occupationsChanged.next(this.occupations.slice());

    })
  }

  
  addOccupation(occupation: Occupation) {
    
    this.dataServerService.addOccupationToServer(occupation);
    occupation.id = this.occupations.length + 2;

    this.occupations.push(occupation);
    this.occupationsChanged.next(this.occupations.slice());
  }


  editOccupation(occupation: Occupation) {

    this.dataServerService.editOccupationToServer(occupation);

    const index = this.occupations.findIndex((elem => elem.id === occupation.id));
    this.occupations[index] = occupation;

    this.occupationsChanged.next(this.occupations.slice());

  }

  deleteOccupation(id: number, index: number) {

    this.dataServerService.deleteOccupationToServer(id).subscribe((res) =>{

      this.occupations.splice(index, 1);
      this.occupationsChanged.next(this.occupations.slice());

    }, (error) => {

      alert('FK Restriction');
    }
    );


  }

}
