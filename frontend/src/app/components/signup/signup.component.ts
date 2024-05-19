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
    this.http = http;
    this.router = router;
  }

  username = new FormControl('', {
    validators: [Validators.required],
  });
  password = new FormControl('', {
    validators: [Validators.required],
  });

  signupForm = new FormGroup({
    username: this.username,
    password: this.password,
  });

  signup() {
    this.http
      .post<any>(`${API_URL}/auth/register`, {
        username: this.username.value,
        password: this.password.value,
      })
      .subscribe(
        () => {
          this.router.navigate(['/login']);
        },
        () => {
          alert('Something went wrong.');
        }
      );
  }
}
