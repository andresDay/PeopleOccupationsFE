 import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PeopleService } from '../shared/services/people.service';
import { Person } from '../shared/models/person.model';
import { Subscription, merge, tap } from 'rxjs';
import { PopupService } from '../shared/services/popup.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('700ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('700ms ease-in', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})

export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  personIndex: number = 0;
  persons: Person[] = [];

  //mat-table
  displayedColumns = ['name', 'age', 'hobbyDescription'];
 

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  
  peopleSubjectSubscription: Subscription = new Subscription;
  popupPersonSubjectSubscription: Subscription = new Subscription;

  editMode = false;

  constructor(private peopleService: PeopleService, private popUpService: PopupService) { }

  ngOnInit(): void {

    const defaultSortType = "asc";
    const defaultPageNumber = 0;
    const defaultPageSize = 3;
    
    this.peopleService.getPeople(defaultSortType, defaultPageNumber, defaultPageSize);

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


      }, error => {
        console.log(error + 'Hubo un error al agregar o editar');
      });

  }

  ngAfterViewInit(): void {
    //cuando uno de los 2 eventos ocurra, se llama al peopleService
    merge(this.sort.sortChange, this.paginator.page)
        .pipe(
        tap(()=> this.peopleService.getPeople(this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize))
    )
    .subscribe();

  }

  OnAddPerson() {
    this.editMode = false;
    this.popUpService.openPersonPopUp(undefined);

  }

  onEditPerson(personIndex: number) {
    this.editMode = true;
    this.popUpService.openPersonPopUp(this.peopleService.persons[personIndex]);

  }


  onDeletePerson(id: number, index: number) {
    this.peopleService.deletePerson(id, index);

  }

  ngOnDestroy() {
    this.peopleSubjectSubscription.unsubscribe();
    this.popupPersonSubjectSubscription.unsubscribe();
  }
  
}
