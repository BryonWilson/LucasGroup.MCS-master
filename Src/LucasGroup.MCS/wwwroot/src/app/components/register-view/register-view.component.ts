import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators
} from '@angular/forms';

import { LoginService, AccountService } from '../../services';
import { IRegistration, Registration, Role } from '../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register-view',
  templateUrl: './register-view.component.html',
  styleUrls: ['./register-view.component.scss']
})
export class RegisterViewComponent implements OnInit {
  errors: string;
  isRequesting = false;
  submitted = false;
  roles: Role[];
  credentials: IRegistration = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    branchId: ''
  };
  branchArray: Observable<any[]>;

  // tslint:disable-next-line:max-line-length
  emailPattern = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;
  // alternative email pattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:
  // \s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

  registerForm: FormGroup;
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _loginService: LoginService,
    private _accountService: AccountService,
    private _fb: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();
    this.getRoles();
    this.branchArray = this._accountService.getBranches();
  }

  buildForm() {
    this.registerForm = this._fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(this.emailPattern)
        ])
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          )
        ])
      ],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      location: ['', Validators.required],
      branchId: ['', Validators.required],
      bullhornUserId: ['', Validators.required],
      bullhornUsername: ['', Validators.required],
      roleName: ['', Validators.required]
    });
  }

  getRoles() {
    this._accountService.getRoles().subscribe(
      data => {
        this.roles = data;
      },
      error => {
        this.errors = error;
      }
    );
  }

  register(form: FormGroup) {
    this.submitted = true;
    this.errors = '';
    console.log('FORM:', form);

    if (!form.invalid) {
      console.log('REGIESTER HIT');
      this.isRequesting = true;

      const registration: Registration = {
        email: form.controls['email'].value,
        password: form.controls['password'].value,
        firstName: form.controls['firstName'].value,
        lastName: form.controls['lastName'].value,
        branchId: form.controls['branchId'].value,
        location: form.controls['location'].value,
        bullhornUserId: form.controls['bullhornUserId'].value,
        bullhornUsername: form.controls['bullhornUsername'].value,
        roleName: form.controls['roleName'].value
      };
      this._loginService.register(registration).subscribe(
        result => {
          if (result) {
            this._router.navigate(['/admin']);
          }
        },
        error => {
          this.isRequesting = false;
          this.errors = error;
        }
      );
    }
  }

  isUsernameValid() {
    const emailPattern = new RegExp(this.emailPattern);
    return emailPattern.test(this.credentials.email);
  }
}
