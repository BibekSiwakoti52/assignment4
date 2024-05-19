import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { API_URL } from '../../../constants';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  constructor(private http: HttpClient, private router: Router) {
    this.http = http; // Initializing HttpClient instance
    this.router = router; // Initializing Router instance
  }

  // Form controls for username and password
  username = new FormControl('', {
    validators: [Validators.required], // Validator for username field
  });
  password = new FormControl('', {
    validators: [Validators.required], // Validator for password field
  });

  // Form group containing username and password form controls
  signupForm = new FormGroup({
    username: this.username,
    password: this.password,
  });

  // Method to handle signup functionality
  signup() {
    this.http // Making HTTP POST request to the register endpoint
      .post<any>(`${API_URL}/auth/register`, {
        username: this.username.value, // Getting username from form control
        password: this.password.value, // Getting password from form control
      })
      .subscribe(
        () => {
          this.router.navigate(['/login']); // Navigating to '/login' route upon successful signup
        },
        () => {
          alert('Something went wrong.'); // Alerting user about error during signup
        }
      );
  }
}
