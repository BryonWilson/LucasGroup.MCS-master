import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MatCheckbox } from '@angular/material';
import {
  MAT_DIALOG_DATA,
  MAT_CHECKBOX_CLICK_ACTION,
  MatSnackBar
} from '@angular/material';
import { element } from 'protractor';
import { BullhornApiService, ConferenceService } from '../../services';
import { Subscription } from 'rxjs';
import { JobSubmissionParams } from './../../models/bullhorn';

@Component({
  selector: 'app-post-to-bullhorn-modal',
  templateUrl: './post-to-bullhorn-modal.component.html',
  styleUrls: ['./post-to-bullhorn-modal.component.scss']
})
export class PostToBullhornModalComponent implements OnInit {
  constructor(
    public _bullhornApiService: BullhornApiService,
    public _conferenceService: ConferenceService,
    private snackBar: MatSnackBar
  ) {
    this.postToBullhornDataSubscription = _conferenceService.postToBullhornData$.subscribe(
      postToBullhornData => {
        this.postToBullhornData = postToBullhornData;
        this.dataSource = postToBullhornData;
      }
    );
  }

  displayedColumns = ['Job', 'Client', 'Candidate', 'Post to Bullhorn'];
  dataSource = null;
  itemsToPostToBullhorn = [];
  isChecked: boolean;
  postToBullhornData: any;
  postToBullhornDataSubscription: Subscription;

  ngOnInit() {
    // this.dataSource = this.data.dataSource;
  }

  handleSelectAllClick(event) {
    if (event.checked && this.dataSource) {
      this.dataSource.forEach(item => {
        console.log('ITEM:', item);
        this.handleCheckClick(item, event);
      });
    }
  }

  handleCheckClick(item, event) {
    if (event.checked) {
      this.itemsToPostToBullhorn.push(item);
    } else if (!event.checked && this.itemsToPostToBullhorn.length > 0) {
      const itemToRemoveIndex = this.itemsToPostToBullhorn.findIndex(
        i => i === item
      );
      this.itemsToPostToBullhorn.splice(itemToRemoveIndex, 1);
    }
  }

  handlePostToBullhorn(array: any[]) {
    let jobSubmissionParams: JobSubmissionParams;
    array.forEach(item => {
      jobSubmissionParams = {
        jobOrderId: item.jobOrderId,
        candidateId: item.candidateId,
        userId: item.userId,
        clientId: item.clientId,
        clientContactId: item.clientContactId,
        dateBegin: item.dateBegin,
        dateEnd: item.dateEnd,
        jobName: item.job
      };
      this._bullhornApiService
      // .submitJobCandidates(item.jobOrderId, item.candidateId, item.userId)
      // .submitCandidates(item.jobOrderId, item.candidateId, item.userId, item.clientId, item.clientContactId)
      .submitCandidates(jobSubmissionParams)
        .subscribe(result => {
          console.log('PUT RESULT:', result);
          if (result) {
            this.openSnackBar('Posted!', '');
          }
        });
    });
  }

  updatePostToBullhornData(postToBullhornData) {
    this._conferenceService.updatePostToBullhornData(postToBullhornData);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }
}
