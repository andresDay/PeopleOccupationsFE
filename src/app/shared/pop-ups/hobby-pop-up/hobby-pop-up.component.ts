import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Hobby } from '../../models/hobby.model';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-hobby-pop-up',
  templateUrl: './hobby-pop-up.component.html',
  styleUrls: ['./hobby-pop-up.component.css']
})
export class HobbyPopUpComponent implements OnInit {
  constructor(
    private popUpService: PopupService,     
    public dialogRef: MatDialogRef<PopupService>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }
  
  hobbyForm = new FormGroup({
    hobbyDescription: new FormControl('', Validators.required)    
  });

  ngOnInit() {
    if (this.data) {
      
      this.hobbyForm.patchValue({
        hobbyDescription: this.data.description,
        
      });
    }    
    
  }

  onCancelAddOrEditHobby() {
    this.popUpService.closeAllModals();
  }

  onSubmit() {
    if (this.hobbyForm.value.hobbyDescription ) {
      const hobby = new Hobby(this.popUpService.hobbyId, this.hobbyForm.controls.hobbyDescription.value as string);
      this.popUpService.sendHobbyToHobbiesService(hobby);
    }
  }

}
