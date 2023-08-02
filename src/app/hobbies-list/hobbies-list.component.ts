import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Hobby } from '../shared/models/hobby.model';
import { Subscription } from 'rxjs';
import { HobbiesService } from '../shared/services/hobbies.service';
import { PopupService } from '../shared/services/popup.service';

@Component({
  selector: 'app-hobbies-list',
  templateUrl: './hobbies-list.component.html',
  styleUrls: ['./hobbies-list.component.css'],
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
export class HobbiesListComponent implements OnInit {

 
  hobbyIndex: number = 0;
  hobbies: Hobby[] = [];

  hobbiesSubjectSubscription: Subscription = new Subscription;
  popupHobbySubjectSubscription: Subscription = new Subscription;

  editMode = false;

  constructor(private hobbiesService: HobbiesService, private popUpService: PopupService) { }

  ngOnInit(): void {

    this.hobbiesService.getHobbies();

    this.hobbiesSubjectSubscription = this.hobbiesService.hobbiesChanged
      .subscribe((res: Hobby[]) => {
        this.hobbies = res;
      });

    this.popupHobbySubjectSubscription = this.popUpService.hobbyAddedOrModified.subscribe(
      (hobby: Hobby) => {
        if (!this.editMode) {
          this.hobbiesService.addHobby(hobby);
          
        } else {
          
          this.hobbiesService.editHobby(hobby);
         
        }
        this.editMode = false;


      }, error => {
        console.log(error + 'Hubo un error al agregar o editar');
      });

  }


  OnAddHobby() {
    this.editMode = false;
    this.popUpService.openHobbyPopUp(undefined);

  }

  onEditHobby(personIndex: number) {
    this.editMode = true;
    this.popUpService.openHobbyPopUp(this.hobbiesService.hobbies[personIndex]);

  }


  onDeleteHobby(id: number, index: number) {
    this.hobbiesService.deleteHobby(id, index);

  }

  ngOnDestroy() {
    this.hobbiesSubjectSubscription.unsubscribe();
    this.popupHobbySubjectSubscription.unsubscribe();
  }


}
