import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Occupation } from '../shared/models/occupation.model';
import { PeopleOccupation } from '../shared/models/peopleOccupation.model';
import { Subscription } from 'rxjs';
import { OccupationsService } from '../shared/services/occupations.service';
import { PopupService } from '../shared/services/popup.service';
import { PeopleOccupationsService } from '../shared/services/people-occupations.service';


@Component({
  selector: 'app-people-occupation-list',
  templateUrl: './people-occupation-list.component.html',
  styleUrls: ['./people-occupation-list.component.css'],
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
export class PeopleOccupationListComponent implements OnInit {

  peopleOccupationIndex: number = 0;
  peopleOccupations: PeopleOccupation[] = [];

  peopleOccupationsSubjectSubscription: Subscription = new Subscription;
  popupPeopleOccupationSubjectSubscription: Subscription = new Subscription;

  editMode = false;

  constructor(private peopleOccupationsService: PeopleOccupationsService, private popUpService: PopupService) { }
  ngOnInit(): void {

    this.peopleOccupationsService.getPeopleOccupations();

    this.peopleOccupationsSubjectSubscription = this.peopleOccupationsService.peopleOccupationsChanged
      .subscribe((res: PeopleOccupation[]) => {
        this.peopleOccupations = res;
      });

    this.popupPeopleOccupationSubjectSubscription = this.popUpService.peopleOccupationsAddedOrModified.subscribe(
      (peopleOccupation: PeopleOccupation) => {
        if (!this.editMode) {
          this.peopleOccupationsService.addPeopleOccupation(peopleOccupation);
          
        } else {
          
          this.peopleOccupationsService.editPeopleOccupation(peopleOccupation);
         
        }
        this.editMode = false;

      }, error => {
        console.log(error + 'Hubo un error al agregar o editar');
      });

  }


  OnAddPeopleOccupation() {
    this.editMode = false;
    this.popUpService.openPeopleOccupationPopUp(undefined);

  }

  onEditPeopleOccupation(peopleOccupationIndex: number) {
    this.editMode = true;
    this.popUpService.openPeopleOccupationPopUp(this.peopleOccupationsService.peopleOccupations[peopleOccupationIndex]);

  }


  onDeletePeopleOccupation(peopleOccupation: PeopleOccupation, index: number) {
    this.peopleOccupationsService.deletePeopleOccupation(peopleOccupation, index);

  }

  ngOnDestroy() {
    this.peopleOccupationsSubjectSubscription.unsubscribe();
    this.popupPeopleOccupationSubjectSubscription.unsubscribe();
  }


}
