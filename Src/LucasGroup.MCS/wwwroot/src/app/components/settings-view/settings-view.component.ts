
import { Component, Input, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';

import { AccountService, LoginService } from '../../services';
import { UserSettings } from '../../models';

@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.scss']
})
export class SettingsViewComponent implements OnInit {
  @Input() userEmail?: any;
  errors: string;
  success: string;
  email: string;
  branchArray: Observable<any[]>;
  isAdmin: boolean;

  settingsForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _accountService: AccountService,
    private _loginService: LoginService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.buildForm();
    this.getSettings();
    this.branchArray = this._accountService.getBranches();
    this.isAdmin = this._loginService.isUserAdmin;
  }

  buildForm() {
    this.settingsForm = this._fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      branchId: [{value: '', disabled: this.isAdmin}, Validators.required],
      bullhornUserId: [{value: '', disabled: this.isAdmin}],
      bullhornUsername: [{value: '', disabled: this.isAdmin}]
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
    const user = this.userEmail ? this._accountService.getUserSettings(this.userEmail) : JSON.parse(localStorage.getItem('currentUser'));
    this.populateForm(user);
    this.email = user.username;
  }

  saveSettings(form: FormGroup) {

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
        // this.success = 'Saved Successfully';
        this.openSnackBar('Saved Successfully', '');
      },
      error => {
        this.errors = error;
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }
}
