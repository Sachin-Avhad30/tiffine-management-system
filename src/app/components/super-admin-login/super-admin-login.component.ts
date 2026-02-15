import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CustomPasswordValidators } from '../../customValidators/custom-password-validators';
import { markAllControlsAsDirtyAndTouched } from '../../../utils';
import { SnackbarService } from '../../services/snackbar.service';
import { JwtHelperService } from '@auth0/angular-jwt'
@Component({
  selector: 'app-super-admin-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './super-admin-login.component.html',
  styleUrl: './super-admin-login.component.css',
})
export class SuperAdminLoginComponent {
  invalidCredential: string = '';
  hide = true;
  // passwordValidity: string = '';
  strongPasswordRegx: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  jwtHelper = new JwtHelperService();
  // Other functions
  // const expirationDate = helper.getTokenExpirationDate(myRawToken);
  // const isExpired = helper.isTokenExpired(myRawToken);
  constructor(
    private authService: AuthService,
    private route: Router,
    private snackbar: SnackbarService
  ) { }
  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      if (this.authService.isAdmin()) {
        this.route.navigate(['/navbar/admin'])
      } else {
        this.route.navigate(['/navbar/home'])

      }

    }
  }
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      // Validators.pattern(this.strongPasswordRegx),
      // Validators.pattern(this.strongPasswordRegx),
      Validators.minLength(8),
      CustomPasswordValidators.logPatternError(),
    ]),
  });
  get email() {
    return this.loginForm.get('email');
  }
  get compulsory() {
    return (
      this.email?.errors?.['required'] &&
      this.password?.touched &&
      this.password?.dirty &&
      this.password?.invalid
    );
  }
  get password() {
    return this.loginForm.get('password');
  }
  get isEmailValid() {
    return (
      this.email?.errors?.['email'] &&
      this.password?.touched &&
      this.password?.dirty &&
      this.password?.invalid
    );
  }
  get minLength() {
    return (
      this.password?.errors?.['minlength'] &&
      this.password?.touched &&
      this.password?.dirty &&
      this.password?.invalid
    );
  }
  get mandatory() {
    return (
      this.password?.errors?.['required'] &&
      this.password?.touched &&
      this.password?.dirty &&
      this.password?.invalid
    );
  }
  get noNumber(): boolean {
    return (
      this.password?.errors?.['noNumber'] &&
      this.password?.touched &&
      this.password?.dirty &&
      this.password?.invalid
    );
  }
  get noSpecialChars(): boolean {
    return (
      this.password?.errors?.['noSpecialChars'] &&
      this.password?.touched &&
      this.password?.dirty &&
      this.password?.invalid
    );
  }
  get noLowerCase(): boolean {
    return (
      this.password?.errors?.['noLowerCase'] &&
      this.password?.touched &&
      this.password?.dirty &&
      this.password?.invalid
    );
  }
  get noUpperCase(): boolean {
    return (
      this.password?.errors?.['noUpperCase'] &&
      this.password?.touched &&
      this.password?.dirty &&
      this.password?.invalid
    );
  }
  get emailErrorMessage(): string {
    switch (true) {
      case this.compulsory:
        return 'Email is required';
      case this.isEmailValid:
        return 'Please enter a valid email address';
      default:
        return '';
    }
  }

  get passwordErrorMessage(): string {
    switch (true) {
      case this.mandatory:
        return 'password is required';
      case this.noNumber:
        return 'at least one number required';
      case this.noSpecialChars:
        return ' at least one special character required';
      case this.noLowerCase:
        return 'at least one lowercase character required';
      case this.noUpperCase:
        return 'at least one upperCase character required';
      case this.minLength:
        return 'minimum 8 characters are required';
      default:
        return '';
    }
  }
  loginAdmin() {
    const login = {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value,
    };
    console.log('outside if loginAdmin');
    console.log('loginCred-', login);
    if (login.password && login.email) {
      const tokenObservable = this.authService.authenticateLogin(login);
      console.log('tokenObservable', tokenObservable);
      tokenObservable.subscribe({
        next: (data) => {
          console.log("login data", data)
          this.authService.saveTokens(data.token, data.refreshToken);
          const decodedToken = this.jwtHelper.decodeToken(data.token);
          console.log('decodedToken', decodedToken);
          console.log('role-----------------------------------------', decodedToken.role);
          this.authService.setRole(decodedToken.role);
          sessionStorage.setItem('id', decodedToken.id);
          if (this.authService.isSuperAdmin()) {
            this.snackbar.showSuccess('Login successfully!');
            this.route.navigate(['/navbar/home']);
          } else {
            this.snackbar.showSuccess('Login successfully!');
            this.route.navigate(['/navbar/admin']);
          }
        },
        error: (error) => {
          console.log('error', error);
          this.snackbar.showError('invalid credentials');
        },
      });
    } else {
      markAllControlsAsDirtyAndTouched(this.loginForm);
    }
  }
}
