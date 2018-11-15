import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-import-jobs-modal-component',
  templateUrl: './import-jobs-modal.component.html',
  styleUrls: ['./import-jobs-modal.component.scss']
})
export class ImportJobsModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ImportJobsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  selectOptions = [];
  selectedOption: any;

  ngOnInit() {
    this.seedOptions();
  }

  seedOptions() {
    if (this.data.list.length > 0) {
    this.data.list.forEach(item => {
      this.selectOptions.push({
        value: { ...item.jobOrders, jobTearsheetId: item.id },
        viewValue: `${item.id} - ${item.name}`
      });
    });
    } else {
      this.selectOptions.push({
        value: {},
        viewValue: 'No Tearsheets found'
      });
    }
    return this.selectOptions;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
