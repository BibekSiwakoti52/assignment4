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
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
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

  loginForm = new FormGroup({
    username: this.username,
    password: this.password,
  });

  login() {
    this.http
      .post<any>(`${API_URL}/auth/login`, {
        username: this.username.value,
        password: this.password.value,
      })
      .subscribe(
        (response) => {
          const token = response.data.token;
          localStorage.setItem('jwtToken', token);
          this.router.navigate(['/questions']);
        },
        (error) => {
          // Handle the error here
          alert('Invalid Credentials');
        }
      );
  }
}
