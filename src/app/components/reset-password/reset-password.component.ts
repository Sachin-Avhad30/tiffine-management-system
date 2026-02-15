import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})

export class ResetPasswordComponent implements OnInit {
  message: string = '';
  error: string = '';
  token: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  resetPasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
  })
  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.error = 'Invalid or missing token.';
    }
  }

  onSubmit() {
    if (this.resetPasswordForm.valid && this.token) {
      const password = this.resetPasswordForm.get('password')?.value;
      if (password != null) {
        this.authService.resetPassword(this.token, password).subscribe({
          next: (response) => {
            this.message = response.message;
            this.error = '';
            setTimeout(() => this.router.navigate(['']), 3000);
          },
          error: (err) => {
            this.error = err.error.message || 'Something went wrong';
            this.message = '';
          },
        });
      }
    }
  }
}

