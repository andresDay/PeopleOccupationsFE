import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PeopleService } from '../shared/services/people.service';
import { Person } from '../shared/models/person.model';
import { Subscription, catchError, merge, tap, throwError } from 'rxjs';
import { PopupService } from '../shared/services/popup.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PeopleFilterArgs } from '../shared/models/Filter/peopleFilterArgs';
import { CardinalityEnum } from '../shared/models/Filter/Generic/sortArgs';


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
  dataSource = new MatTableDataSource<Person>();
  displayedColumns = ['name', 'age', 'hobbyDescription', 'Edit-Delete'];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  peopleSubjectSubscription: Subscription = new Subscription;
  popupPersonSubjectSubscription: Subscription = new Subscription;
  getPeopleNoRecordsSubjectSubscription: Subscription = new Subscription

  editMode = false;

  peopleCount = 0;

  previousNameFilterValue: string | undefined | null = null;
  previousAgeFilterValue: number | undefined | null = null;
  previousHobbyIdFilterValue: number | undefined | null = null;

  peopleFilterArgs = this.initializePeopleFilterArgs();

  constructor(public peopleService: PeopleService, private popUpService: PopupService) { }

  ngOnInit(): void {

    this.getPeopleNoRecordsSubjectSubscription = this.peopleService.getNoRecords
    .subscribe((res: string) =>{
      this.dataSource.data = [];
      // alert(res);
    });
    this.peopleSubjectSubscription = this.peopleService.peopleChanged
      .subscribe((res: Person[]) => {
        this.persons = res;
        this.refreshTable();
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

    this.peopleService.getPeople(this.peopleFilterArgs);

    //when sorting, go to page 0
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    //when one of these events occur, call peopleService
    merge(this.sort.sortChange, this.paginator.page)

      .pipe(
        tap(() =>
          this.peopleFilterArgs = {

            sortArgs: {
              sortBy: this.sort.active,
              sortCardinality: this.sortDirectionToEnum(this.sort.direction)
            },

            paginationArgs: {
              pageNumber: this.paginator.pageIndex,
              pageSize: this.paginator.pageSize,
            },

            nameFilterValue: this.previousNameFilterValue,
            ageFilterValue: this.previousAgeFilterValue,
            hobbyIdFilterValue: this.previousHobbyIdFilterValue
          }
        ),
        tap(() =>

          this.peopleService.getPeople(this.peopleFilterArgs)
        )
      ).subscribe();

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
    this.getPeopleNoRecordsSubjectSubscription.unsubscribe();
  }

  applyFilter(event: Event, columnName: string) {

    //when filtering, go to page 0
    this.paginator.pageIndex = 0;
    //here reset the sort in browser

    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value;

    //to allow filter simultaneity
    switch (columnName) {

      case 'nameFilter': this.previousNameFilterValue = filterValue.trim().toLowerCase(); break;
      case 'ageFilter': this.previousAgeFilterValue = filterValue.trim() as unknown as number; break;
      case 'hobbyDescriptionFilter': this.previousHobbyIdFilterValue = filterValue.trim() as unknown as number; break;

    }

    this.peopleFilterArgs = {

      sortArgs: {
        sortBy: this.sort.active,
        sortCardinality: this.sortDirectionToEnum(this.sort.direction)
      },

      paginationArgs: {
        pageNumber: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize,
      },

      nameFilterValue: this.previousNameFilterValue,
      ageFilterValue: this.previousAgeFilterValue,
      hobbyIdFilterValue: this.previousHobbyIdFilterValue
    }

    this.peopleService.getPeople(this.peopleFilterArgs);
  }

  refreshTable() {
    this.peopleCount = this.peopleService.peopleCount;
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
    this.dataSource.data = this.persons;

  };

  initializePeopleFilterArgs(): PeopleFilterArgs {

    const initialPageNumber = 0;
    const initialPageSize = 5;

    const newPeopleFilterArgs: PeopleFilterArgs = {

      sortArgs: undefined,

      paginationArgs: {
        pageNumber: initialPageNumber,
        pageSize: initialPageSize,
      },

      nameFilterValue: null,
      ageFilterValue: null,
      hobbyIdFilterValue: null

    }

    return newPeopleFilterArgs;
  }


  sortDirectionToEnum(sortDirection: string): CardinalityEnum {
    if (sortDirection == 'asc') {
      return CardinalityEnum.asc;
    }

    if (sortDirection == 'desc') {
      return CardinalityEnum.desc;
    }

    return CardinalityEnum.noSort

  }

  //unused so far
  resetPreviousFilterValues() {
    this.previousNameFilterValue = null;
    this.previousAgeFilterValue = null;
    this.previousHobbyIdFilterValue = null;

  }

}
