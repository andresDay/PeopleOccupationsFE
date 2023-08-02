import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Occupation } from '../shared/models/occupation.model';
import { PopupService } from '../shared/services/popup.service';
import { OccupationsService } from '../shared/services/occupations.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-occupation-list',
  templateUrl: './occupation-list.component.html',
  styleUrls: ['./occupation-list.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('700ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('700ms ease-in', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class OccupationListComponent implements OnInit {

  
 
  occupationIndex: number = 0;
  occupations: Occupation[] = [];

  occupationsSubjectSubscription: Subscription = new Subscription;
  popupOccupationSubjectSubscription: Subscription = new Subscription;

  editMode = false;

  constructor(private occupationsService: OccupationsService, private popUpService: PopupService) { }

  ngOnInit(): void {

    this.occupationsService.getOccupations();

    this.occupationsSubjectSubscription = this.occupationsService.occupationsChanged
      .subscribe((res: Occupation[]) => {
        this.occupations = res;
      });

    this.popupOccupationSubjectSubscription = this.popUpService.occupationsAddedOrModified.subscribe(
      (occupation: Occupation) => {
        if (!this.editMode) {
          this.occupationsService.addOccupation(occupation);
          
        } else {
          
          this.occupationsService.editOccupation(occupation);
         
        }
        this.editMode = false;


      }, error => {
        console.log(error + 'Hubo un error al agregar o editar');
      });

  }


  OnAddOccupation() {
    this.editMode = false;
    this.popUpService.openOccupationPopUp(undefined);

  }

  onEditOccupation(personIndex: number) {
    this.editMode = true;
    this.popUpService.openOccupationPopUp(this.occupationsService.occupations[personIndex]);

  }


  onDeleteOccupation(id: number, index: number) {
    this.occupationsService.deleteOccupation(id, index);

  }

  ngOnDestroy() {
    this.occupationsSubjectSubscription.unsubscribe();
    this.popupOccupationSubjectSubscription.unsubscribe();
  }


}
