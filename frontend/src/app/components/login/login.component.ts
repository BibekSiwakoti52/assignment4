import { HttpClient } from '@angular/common/http'; // Importing HttpClient to make HTTP requests
import { Component } from '@angular/core'; // Importing Component decorator
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
  loginForm = new FormGroup({
    username: this.username,
    password: this.password,
  });

  // Method to handle login functionality
  login() {
    this.http // Making HTTP POST request to the login endpoint
      .post<any>(`${API_URL}/auth/login`, {
        username: this.username.value, // Getting username from form control
        password: this.password.value, // Getting password from form control
      })
      .subscribe(
        (response) => {
          const token = response.data.token; // Extracting token from the response
          localStorage.setItem('jwtToken', token); // Storing token in local storage
          this.router.navigate(['/questions']); // Navigating to '/questions' route upon successful login
        },
        (error) => {
          // Handling error
          alert('Invalid Credentials'); // Alerting user about invalid credentials
        }
      );
  }
}
