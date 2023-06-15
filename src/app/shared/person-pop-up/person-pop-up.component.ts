import { Component, Inject, OnInit } from '@angular/core';
import { PopupService } from '../popup.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Person } from '../person.model';

@Component({
  selector: 'app-person-pop-up',
  templateUrl: './person-pop-up.component.html',
  styleUrls: ['./person-pop-up.component.css']
})
export class PersonPopUpComponent implements OnInit {

  constructor(
    private popUpService: PopupService,
    public dialogRef: MatDialogRef<PopupService>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  personForm = new FormGroup({
    name: new FormControl('', Validators.required),
    occupation: new FormControl('', Validators.required)
  });

  ngOnInit() {
    if(this.data){      
      this.personForm.patchValue({
        name: this.data.name,
        occupation: this.data.occupation
      });
    }
  }

  onCancelAddOrEditPerson() {
    this.popUpService.closeAllModals();
  }

  onSubmit() {
    if (this.personForm.value.name && this.personForm.value.occupation) {
      const newPerson = new Person(this.popUpService.personId, this.personForm.value.name, this.personForm.value.occupation);
      this.popUpService.sendPersonToPeopleService(newPerson);
    }
  }
}
