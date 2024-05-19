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
export class CreatePostComponent {
  constructor(private http: HttpClient, private router: Router) {
    this.http = http;
    this.router = router;
  }

  title = new FormControl('', {
    validators: [Validators.required],
  });
  body = new FormControl('', {
    validators: [Validators.required],
  });

  questionForm = new FormGroup({
    title: this.title,
    body: this.body,
  });

  createQuestion() {
    this.http
      .post<any>(`${API_URL}/question`, {
        title: this.title.value,
        body: this.body.value,
      })
      .subscribe(
        () => {
          console.log('question created');
          this.router.navigate(['/questions']);
        },
        () => {
          // Handle the error here
          alert('Cannot create question.');
        }
      );
  }
}
