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
  selector: 'app-create-post',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
// Class definition for the component
export class CreatePostComponent {
  // Constructor for the component, injecting HttpClient and Router
  constructor(private http: HttpClient, private router: Router) {
    this.http = http;
    this.router = router;
  }

  // FormControl for the post title with required validation
  title = new FormControl('', {
    validators: [Validators.required],
  });

  // FormControl for the post body with required validation
  body = new FormControl('', {
    validators: [Validators.required],
  });

  // FormGroup containing the title and body form controls
  questionForm = new FormGroup({
    title: this.title,
    body: this.body,
  });

  // Method to create a question/post
  createQuestion() {
    // Sending a POST request to the API endpoint to create the question/post
    this.http
      .post<any>(`${API_URL}/question`, {
        title: this.title.value,
        body: this.body.value,
      })
      .subscribe(
        () => {
          // On success, log a message and navigate to the questions page
          console.log('question created');
          this.router.navigate(['/questions']);
        },
        () => {
          // On error, handle the error (in this case, showing an alert)
          alert('Cannot create question.');
        }
      );
  }
}