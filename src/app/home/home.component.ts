import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PeopleService } from '../shared/services/people.service';
import { Person } from '../shared/models/person.model';
import { Subscription, catchError, merge, tap, throwError } from 'rxjs';
import { PopupService } from '../shared/services/popup.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { PeopleFilterArgs } from '../shared/models/Filter/peopleFilterArgs';
import { CardinalityEnum } from '../shared/models/Filter/Generic/sortArgs';
import { FilterOperator } from '../shared/models/Filter/filterOperators';


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
  displayedColumns = ['name', 'age', 'hobbyDescription', 'lastModified', 'Edit-Delete'];

  // @ViewChild(MatTable, { static: true }) table!: MatTable<Person>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  peopleSubjectSubscription: Subscription = new Subscription;
  popupPersonSubjectSubscription: Subscription = new Subscription;
  getPeopleNoRecordsSubjectSubscription: Subscription = new Subscription

  editMode = false;

  peopleCount = 0;

  //filters
  nameFilterValue: string | undefined | null = null;
  ageFilterValue: number | undefined | null = null;
  hobbyIdFilterValue: number | undefined | null = null;

  selectedDate: Date | null = null;

  filterOperators = Object.keys(FilterOperator).filter((v) => isNaN(Number(v)));
  lastModifiedSelectedOperator: FilterOperator | null = null; //default
  ageSelectedOperator: FilterOperator | null = null; //default
  isFilterHidden: boolean = false;

  peopleFilterArgs = this.initializePeopleFilterArgs();

  constructor(public peopleService: PeopleService, private popUpService: PopupService) { }

  ngOnInit(): void {

    this.getPeopleNoRecordsSubjectSubscription = this.peopleService.getNoRecords
      .subscribe((res: string) => {
        this.dataSource.data = [];
        // alert(res);
      });
    this.peopleSubjectSubscription = this.peopleService.peopleChanged
      .subscribe((res: Person[]) => {
        this.persons = res;
        this.refreshTableFromPeopleService();
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

    this.getPeople();

    //when sorting, go to page 0
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    //when one of these events occur, call peopleService
    merge(this.sort.sortChange, this.paginator.page)

      .pipe(
        tap(() =>
          this.setCurrentFilterArgs()
        ),
        tap(() =>

          this.peopleService.getPeople(this.peopleFilterArgs)
        ),
      ).subscribe();

  }

  //CRUD API
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

  
  reloadTableFromServer() {
    //if reset filters applied or manually deleted
    this.getPeople();    
    this.refreshTableFromPeopleService();
  }

  refreshTableFromPeopleService() {
    this.peopleCount = this.peopleService.peopleCount;
    this.dataSource.data = this.persons;
  };
  
 
  getPeople() {

    if(this.areAllFiltersEmpty())
      this.peopleFilterArgs = this.initializePeopleFilterArgs();
    else
      this.setCurrentFilterArgs();

    this.peopleService.getPeople(this.peopleFilterArgs);
  }

  //Filters Section
  
  setCurrentFilterArgs() {
    this.peopleFilterArgs = {

      sortArgs: {
        sortBy: this.sort.active,
        sortCardinality: this.sortDirectionToEnum(this.sort.direction)
      },

      paginationArgs: {
        pageNumber: this.paginator.pageIndex,
        pageSize: this.paginator.pageSize,
      },

      nameFilterValue: this.nameFilterValue,
      ageFilterValue: this.ageFilterValue,
      ageFilterOperator: this.ageSelectedOperator,
      hobbyIdFilterValue: this.hobbyIdFilterValue,
      lastModifiedFilterValue: this.selectedDate?.toISOString(),
      lastModifiedFilterOperator: this.lastModifiedSelectedOperator

    }

  }

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
      ageFilterOperator: null,
      hobbyIdFilterValue: null,
      lastModifiedFilterValue: null,
      lastModifiedFilterOperator: FilterOperator.Equal

    }

    return newPeopleFilterArgs;
  }

 
  toggleShowHideFiltersRow() {
    this.isFilterHidden = !this.isFilterHidden;
  }

  areAllFiltersEmpty(): boolean {

    return !this.nameFilterValue && !this.ageFilterValue
      && !this.hobbyIdFilterValue && !this.selectedDate
      && !this.lastModifiedSelectedOperator && !this.ageSelectedOperator;
  }

  onDateOrOperatorChange(event: any) {
    this.getPeople()
  }
  
  onAgeOperatorChange(event: any){
    this.getPeople()
    
  }
  
  resetFilterValues() {

    this.nameFilterValue = null;
    this.ageFilterValue = null;
    this.ageSelectedOperator = null;
    this.hobbyIdFilterValue = null;
    this.selectedDate = null;
    this.lastModifiedSelectedOperator = null;

    this.getPeople();
  }

  applyFilter(event: Event, columnName: string) {

    //when filtering, go to page 0
    this.paginator.pageIndex = 0;

    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value;

    switch (columnName) {

      case 'nameFilter': this.nameFilterValue = filterValue.trim().toLowerCase(); break;
      case 'ageFilter': this.ageFilterValue = filterValue.trim() as unknown as number; break;
      case 'hobbyDescriptionFilter': this.hobbyIdFilterValue = filterValue.trim() as unknown as number; break;
      default: break;

    }

    this.setCurrentFilterArgs()

    this.peopleService.getPeople(this.peopleFilterArgs);

  }

  //sort section
  sortDirectionToEnum(sortDirection: string): CardinalityEnum {
    if (sortDirection == 'asc') {
      return CardinalityEnum.asc;
    }

    if (sortDirection == 'desc') {
      return CardinalityEnum.desc;
    }

    return CardinalityEnum.noSort

  }

  ngOnDestroy() {
    this.peopleSubjectSubscription.unsubscribe();
    this.popupPersonSubjectSubscription.unsubscribe();
    this.getPeopleNoRecordsSubjectSubscription.unsubscribe();
  }  

}
