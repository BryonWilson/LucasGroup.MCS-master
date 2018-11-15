import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';

import { AccountService } from '../../services';
import { UserSettings } from '../../models';

@Component({
  selector: 'app-user-details-view',
  templateUrl: './user-details-view.component.html',
  styleUrls: ['./user-details-view.component.scss']
})
export class UserDetailsViewComponent implements OnInit {
  errors: string;
  success: string;
  email: string;
  branchArray: Observable<any[]>;

  settingsForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _accountService: AccountService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.getSettings();
    this.branchArray = this._accountService.getBranches();
  }

  buildForm() {
    this.settingsForm = this._fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      branchId: ['', Validators.required],
      bullhornUserId: [''],
      bullhornUsername: ['']
    });
    this.settingsForm.controls['branchId'].setValue('1', {onlySelf: true});
  }

  populateForm(settings: UserSettings) {
    this.settingsForm.patchValue({
      firstName: settings.firstName,
      lastName: settings.lastName,
      branchId: settings.branchId,
      bullhornUserId: settings.bullhornUserId,
      bullhornUsername: settings.bullhornUsername
    });
  }

  getSettings() {
    const user = JSON.parse(localStorage.getItem('selectedUser'));
    this.email = user.username;
    this.populateForm(user);
  }

  saveSettings(form: FormGroup) {
    console.log(form);
    const settings: UserSettings = {
      email: this.email,
      firstName: form.controls['firstName'].value,
      lastName: form.controls['lastName'].value,
      bullhornUserId: form.controls['bullhornUserId'].value,
      bullhornUsername: form.controls['bullhornUsername'].value,
      branchId: form.controls['branchId'].value
    };
    this._accountService.saveUserSettings(settings).subscribe(
      result => {
        // TODO: this needs to be flexible when dealing with admins changing data for other users.
        this._accountService.getUserSettings().subscribe(data => {
          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              branchId: data.branchId,
              bullhornUserId: data.bullhornUserId,
              firstName: data.firstName,
              lastName: data.lastName,
              username: data.email
            })
          );
        });
        this.success = 'Saved Successfully';
      },
      error => {
        this.errors = error;
      }
    );
  }
}
