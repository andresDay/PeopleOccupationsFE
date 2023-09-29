
import { Component, Inject, OnInit } from '@angular/core';
import { PopupService } from '../../services/popup.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Person } from '../../models/person.model';
import { HobbiesService } from '../../services/hobbies.service';
import { Hobby } from '../../models/hobby.model';
import { DataServerService } from '../../services/dataserver.service';
import { PeopleService } from '../../services/people.service';

@Component({
  selector: 'app-person-pop-up',
  templateUrl: './person-pop-up.component.html',
  styleUrls: ['./person-pop-up.component.css']
})
export class PersonPopUpComponent implements OnInit {

  constructor(
    private popUpService: PopupService,
    private dataserverService: DataServerService,
    private peopleService: PeopleService,
    public dialogRef: MatDialogRef<PopupService>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  hobbiesDropdown: Hobby[] = [];
  selectedHobbyId: number | undefined = undefined;
  selectedHobbyDescription: string | null = null;

  personForm = new FormGroup({
    name: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
    hobby: new FormControl('', Validators.required),
  });

  ngOnInit() {
    if (this.data) {
      
      this.selectedHobbyId = this.data.hobbyId;
      this.selectedHobbyDescription = this.data.hobbyDescription;

      this.personForm.patchValue({
        name: this.data.name,
        age: this.data.age,
        hobby: this.data.hobbyDescription
      });
    }

    this.dataserverService.getHobbiesFromServer().subscribe((res) => {//acá llamar al hobbies service
      this.hobbiesDropdown = res;
      
    });

    this.personForm.controls.hobby.valueChanges.subscribe(newHobbySelected => {
      const selectedHobbyObject = this.hobbiesDropdown.find((item) => item.description === newHobbySelected);
      this.selectedHobbyId = selectedHobbyObject?.id;      
      this.selectedHobbyDescription = newHobbySelected;
      
    });
  }

  onCancelAddOrEditPerson() {
    this.popUpService.closeAllModals();
  }

  onSubmit() {
    if (this.personForm.value.name && this.personForm.value.age && this.personForm.value.hobby) {
      const person = new Person(this.popUpService.personId, this.personForm.value.name, Number(this.personForm.value.age),  this.selectedHobbyDescription,  this.selectedHobbyId as number, null);
      this.popUpService.sendPersonToPeopleService(person);
    }
  }

}
