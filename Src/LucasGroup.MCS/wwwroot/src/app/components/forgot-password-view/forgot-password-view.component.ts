import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';


import { LoginService } from '../../services';
import { ResetEmail, ResetPassword } from '../../models';

@Component({
  selector: 'app-forgot-password-view',
  templateUrl: './forgot-password-view.component.html',
  styleUrls: ['./forgot-password-view.component.scss']
})
export class ForgotPasswordViewComponent implements OnInit {
  token: string;
  isRequesting = false;
  showEmailPassword = true;
  errors: string;
  submitted = false;
  resetErrors: string;
  resetSubmitted = false;

  // tslint:disable-next-line:max-line-length
  emailPattern = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;
  requestForm: FormGroup;
  resetForm: FormGroup;

  constructor(private _router: Router,
              private _activatedRoute: ActivatedRoute,
              private _loginService: LoginService,
              private _fb: FormBuilder) { }


  ngOnInit() {
    this.token = this._activatedRoute.snapshot.params.token;
    this.showEmailPassword = !(!!this.token);
    this.buildForms();
  }

  buildForms() {
    this.requestForm = this._fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])]
    });

    this.resetForm = this._fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      newPassword: ['', Validators.required]
    });
  }

  emailPassword(form: FormGroup) {
    this.submitted = true;
    this.errors = '';

    if (!form.invalid) {
      this.isRequesting = true;

      const email = form.controls['email'].value;
      this._loginService.forgotPassword(email)
        .subscribe(
          data => {
            if (data) {
              this.isRequesting = false;
              this.errors = `Reset Password Email Sent to ${email}`;
            }
          },
          error => {
            this.isRequesting = false;
            this.errors = error;
          }
        );
    }
  }

  resetPassword(form: FormGroup) {
    this.resetSubmitted = true;
    this.resetErrors = '';
    if (!form.invalid) {
      this.isRequesting = true;

      const resetPassword: ResetPassword = {
        email: form.controls['email'].value,
        password: form.controls['newPassword'].value,
        code: this.token
      };
      this._loginService.resetPassword(resetPassword)
        .subscribe(
          data => {
            this.isRequesting = false;
            if (data) {
              this.errors = 'Password Changed Successfully';
            } else {
              this.errors = 'There was a problem resetting your password.';
            }
          },
          error => {
            this.isRequesting = false;
            this.errors = error;
          }
        );
    }
  }

}
