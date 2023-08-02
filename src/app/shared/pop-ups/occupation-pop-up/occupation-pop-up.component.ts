import { Component, Inject, OnInit } from '@angular/core';
import { Occupation } from '../../models/occupation.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-occupation-pop-up',
  templateUrl: './occupation-pop-up.component.html',
  styleUrls: ['./occupation-pop-up.component.css']
})
export class OccupationPopUpComponent implements OnInit {

  constructor(
    private popUpService: PopupService,     
    public dialogRef: MatDialogRef<PopupService>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }
  
  occupationForm = new FormGroup({
    occupationDescription: new FormControl('', Validators.required)    
  });

  ngOnInit() {
    if (this.data) {
      
      this.occupationForm.patchValue({
        occupationDescription: this.data.description,
        
      });
    }    
    
  }

  onCancelAddOrEditOccupation() {
    this.popUpService.closeAllModals();
  }

  onSubmit() {
    if (this.occupationForm.value.occupationDescription ) {
      const occupation = new Occupation(this.popUpService.occupationId, this.occupationForm.controls.occupationDescription.value as string);
      this.popUpService.sendOccupationToOccupationsService(occupation);
    }
  }


}
