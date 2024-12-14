import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  passwordError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          // Validators.required,
          // Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/),
        ],
      ],
      password: ['', []],
    });
  }

  onSubmit(): void {
    this.passwordError = false;
    if (this.loginForm.valid) {
      const loginData = this.loginForm.getRawValue();
      this.http.post('http://localhost:4000/api/login', loginData).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Success!',
            text: 'You have logged in successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            this.loginForm.reset();
            this.router.navigate(['/search']);
          });
        },
        error: (error) => {
          if (error.status === 401) {
            this.passwordError = true;
          }
          console.error('Login error:', error);
          // Swal.fire({
          //   title: 'Error!',
          //   text: 'Login failed.',
          //   icon: 'error',
          //   confirmButtonText: 'OK',
          // });
        },
      });
    } else {
      // Swal.fire({
      //   title: 'Validation Error!',
      //   text: 'Please fill in all required fields correctly.',
      //   icon: 'warning',
      //   confirmButtonText: 'OK',
      // });
    }
  }
}
