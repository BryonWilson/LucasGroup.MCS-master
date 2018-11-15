// tslint:disable-next-line:import-blacklist
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';


import { LoginService } from '../../services';
import { ICredentials } from '../../models';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  errors: string;
  isRequesting = false;
  submitted = false;
  credentials: ICredentials = { email: '', password: '' };

  loginForm: FormGroup;
  constructor(private _router: Router,
  private _activatedRoute: ActivatedRoute,
  private _loginService: LoginService,
  private _fb: FormBuilder) {
    this._loginService.logout();
  }

  ngOnInit() {
    this.buildForm();

    // this.subscription = this._activatedRoute.queryParams.subscribe(
    //   (param: any) => {
    //      this.credentials.email = param['email'];
    //   });

  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  buildForm() {
    this.loginForm = this._fb.group({
      email: ['', Validators.compose([Validators.required, Validators.minLength(6),
      // tslint:disable-next-line:max-line-length
      Validators.pattern(/[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/)])],
      // tslint:disable-next-line:max-line-length
      // alternative email pattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      password: ['', Validators.compose([Validators.required, Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)])],
    });
  }

  validateLogin = () => {
    try {
        if (!this.credentials.email) {
            throw 'Email Is Required';
        }
        if (!this.credentials.password) {
            throw 'Password Is Required';
        }
        if (!this.isUsernameValid()) {
            throw 'Invalid log in. Please contact your administrator.';
        } else {
            return true;
        }
    } catch (e) {
        this.errors = e;
        return false;
    }
  }

  login(form: FormGroup) {
    this.errors = '';

    if (!form.invalid) {
      this.submitted = true;
      this.isRequesting = true;

      this._loginService.login(form.controls['email'].value, form.controls['password'].value)
        .subscribe(
          result => {
            if (result) {
              this._router.navigate(['/home']);
            }
          },
          error => {
            this.isRequesting = false;
            this.errors = error;
          }
        );
    } else {
      this.errors = 'Form Invalid';
    }
  }

  isUsernameValid() {
    // tslint:disable-next-line:max-line-length
    const emailPattern = new RegExp(/[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/);
    return emailPattern.test(this.credentials.email);
  }

}
