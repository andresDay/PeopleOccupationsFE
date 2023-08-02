import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Occupation } from '../../models/occupation.model';
import { Person } from '../../models/person.model';
import { DataServerService } from '../../services/dataserver.service';
import { PeopleOccupationsService } from '../../services/people-occupations.service';
import { PopupService } from '../../services/popup.service';
import { PeopleOccupation } from '../../models/peopleOccupation.model';

@Component({
  selector: 'app-people-occupation-pop-up',
  templateUrl: './people-occupation-pop-up.component.html',
  styleUrls: ['./people-occupation-pop-up.component.css']
})
export class PeopleOccupationPopUpComponent implements OnInit {


  constructor(
    private popUpService: PopupService,
    private dataserverService: DataServerService,
    private peopleOccupationsService: PeopleOccupationsService,
    public dialogRef: MatDialogRef<PopupService>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  occupationsDropdown: Occupation[] = [];
  peopleDropdown: Person[] = [];


  selectedOccupationId: number | undefined = undefined;
  selectedOccupationDescription: string | null = null;

  selectedPersonId: number | undefined = undefined;
  selectedPersonName: string | null = null;

  oldOccupationId: number | undefined = undefined;
  oldPersonId: number | undefined = undefined;


  peopleOccupationForm = new FormGroup({
    name: new FormControl('', Validators.required),
    occupation: new FormControl('', Validators.required),

  });

  ngOnInit() {
    if (this.data) {

      this.selectedOccupationId = this.data.occupationId;
      this.selectedOccupationDescription = this.data.occupationDescription;
      
      this.selectedPersonId = this.data.peopleId;
      this.selectedPersonName = this.data.peopleName;
      
      this.oldOccupationId = this.data.occupationId
      this.oldPersonId = this.data.peopleId;
      
      this.peopleOccupationForm.patchValue({
        name: this.data.peopleName,
        occupation: this.data.occupationDescription,

      });
    }

    this.dataserverService.getOccupationsFromServer().subscribe((res) => {
      this.occupationsDropdown = res;
    });
    this.dataserverService.getPeopleFromServer().subscribe((res) => {
      this.peopleDropdown = res;
    });

    this.peopleOccupationForm.controls.occupation.valueChanges.subscribe(newOccupationSelected => {
      const selectedOccupationObject = this.occupationsDropdown.find((item) => item.description === newOccupationSelected);
      this.selectedOccupationId = selectedOccupationObject?.id;
      this.selectedOccupationDescription = newOccupationSelected;

    });
    this.peopleOccupationForm.controls.name.valueChanges.subscribe(newPersonSelected => {
      const selectedPersonObject = this.peopleDropdown.find((item) => item.name === newPersonSelected);
      this.selectedPersonId = selectedPersonObject?.id;
      this.selectedPersonName = newPersonSelected;

    });

  }

  onCancelAddOrEditPeopleOccupation() {
    this.popUpService.closeAllModals();
  }

  onSubmit() {
    if (this.peopleOccupationForm.value.name && this.peopleOccupationForm.value.occupation) {
      
      const oldPeopleOccupation = new PeopleOccupation(this.oldOccupationId as number, this.oldPersonId as number, null, null);
      this.peopleOccupationsService.oldPeopleOccupation = oldPeopleOccupation;

      const newPeopleOccupation = new PeopleOccupation(this.selectedOccupationId as number, this.selectedPersonId as number, this.selectedOccupationDescription, this.selectedPersonName);
            

      this.popUpService.sendPeopleOccupationToPeopleOccupationsService(newPeopleOccupation);
    }
  }


}
