import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-import-candidates-modal-component',
  templateUrl: './import-candidates-modal.component.html',
  styleUrls: ['./import-candidates-modal.component.scss']
})
export class ImportCandidatesModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ImportCandidatesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  selectOptions = [];
  selectedOption = null;

  ngOnInit() {
    this.seedOptions();
  }

  seedOptions() {
    console.log(this.data);
    if (this.data.list.length > 0) {
    this.data.list.forEach(item => {
      this.selectOptions.push({
        value: { ...item.candidates, candidateTearsheetId: item.id },
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
