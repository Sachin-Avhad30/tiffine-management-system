import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatInputModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  constructor(private authService: AuthService) { }
  errorMessage: string = ""
  isPasswordResetLinkSent: boolean = false
  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })
  get isEmailInvalid() {
    return (
      this.forgotPasswordForm.controls.email.touched &&
      this.forgotPasswordForm.controls.email.invalid &&
      this.forgotPasswordForm.controls.email.dirty
    );
  }
  forgotPassword() {
    if (this.forgotPasswordForm.valid) {
      console.log(this.forgotPasswordForm);
      const userEmail = this.forgotPasswordForm.controls.email.value
      if (userEmail != null) {
        const forgotPasswordData = this.authService.forgotPassword(userEmail);
        forgotPasswordData.subscribe({
          next: (response) => {
            console.log('response', response);
            this.isPasswordResetLinkSent = true
          },
          error: (err) => {
            console.log('error', err.error.error);
            this.isPasswordResetLinkSent = false
            this.errorMessage = err.error.error
          }
        })
      }
    }
  }
}
