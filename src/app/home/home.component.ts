import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PeopleService } from '../shared/people.service';
import { Person } from '../shared/person.model';
import { Subscription } from 'rxjs';
import { PopupService } from '../shared/popup.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('700ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('700ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {

  personIndex: number = 0;
  persons: Person[] = [];

  peopleSubjectSubscription: Subscription = new Subscription;
  popupPersonSubjectSubscription: Subscription = new Subscription;

  editMode = false;

  constructor(private peopleService: PeopleService, private popUpService: PopupService) { }

  ngOnInit(): void {

    this.peopleService.getPeople();

    this.peopleSubjectSubscription = this.peopleService.peopleChanged
      .subscribe((res: Person[]) => {
        this.persons = res;        
      });

      this.popupPersonSubjectSubscription = this.popUpService.personAddedOrModified.subscribe(
        (person: Person) => {
          if (!this.editMode) {
            this.peopleService.addPerson(person);
  
          } else {
  
            this.peopleService.editPerson(person);
          }
          this.editMode = false;
          
  
        },error => {
          console.log('Hubo un error al agregar o editar');
        });

    }


  OnAddPerson(){
   this.editMode = false;
   this.popUpService.openPersonPopUp(undefined); 

  }

  onEditPerson(personIndex: number){
    this.editMode = true;
    this.popUpService.openPersonPopUp(this.peopleService.persons[personIndex]);

  }


  onDeletePerson(id: number, index: number){
    this.peopleService.deletePerson(id, index);

  }

  ngOnDestroy(){
    this.peopleSubjectSubscription.unsubscribe();
    this.popupPersonSubjectSubscription.unsubscribe();
      
  }
}
