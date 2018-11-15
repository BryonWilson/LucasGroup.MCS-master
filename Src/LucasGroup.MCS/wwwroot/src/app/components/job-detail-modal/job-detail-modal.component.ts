import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { BullhornApiService } from '../../services';
import { Job } from '../../models/bullhorn';
import { ConferenceService } from '../../services/conference.service';

@Component({
  selector: 'app-job-detail-modal',
  templateUrl: './job-detail-modal.component.html',
  styleUrls: ['./job-detail-modal.component.scss']
})
export class JobDetailModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<JobDetailModalComponent>,
    private _bullhornApiService: BullhornApiService,
    private _conferenceService: ConferenceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  jobDetails: Job;
  interviewersCurrentName: string;
  defaultStartTimePicker = '';
  defaultSessionIntervals = ['15 mins', '30 mins', '45 mins', '60 mins'];
  clientDetails: any;

  ngOnInit() {
    this._bullhornApiService.getJobDetails(this.data).subscribe(result => {
      console.log('JOB:', result);
      this.jobDetails = result;
    });
  }

  handleSave() {
    const newName = this.interviewersCurrentName.split(' ');
    if (newName.length === 2) {
      const interviewObject = {
        firstName: newName[0],
        lastName: newName[1]
      };

      this._conferenceService.updateInterviewerName(
        this.jobDetails.id,
        interviewObject
      );
    }
  }

  handleNameChange(event) {
    this.interviewersCurrentName = event.target.value;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
