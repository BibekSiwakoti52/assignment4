import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { API_URL } from '../../constants';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './question.component.html',
})
export class QuestionComponent {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.http = http;
    this.route = route;
    this.router = router;
  }

 // Variables to store question and answers
 questionId: string = '';
 question: any;
 answers: any;

 showAnswerForm = false; // Flag to show/hide answer form

 // FormControl for new answer input
 newAnswer = new FormControl('');

 // FormGroup for the answer form
 answerForm = new FormGroup({
   newAnswer: this.newAnswer,
 });

 // Method to post an answer
 postAnswer(id: string) {
   this.http
     .post(`${API_URL}/answer?questionId=${id}`, {
       answer: this.newAnswer.value,
     })
     .subscribe(
       () => {
         this.getQuestionAnswers(id); // Refresh answers after posting
         this.showAnswerForm = false; // Hide answer form
         this.newAnswer.setValue(''); // Clear new answer input
       },
       (err) => {
         alert(err.error.message); // Show error alert if post fails
       }
     );
 }

 // Method to fetch question details
 getQuestionDetails(id: string) {
   return this.http
     .get(`${API_URL}/question/${id}`)
     .subscribe((response: any) => {
       if (response) {
         this.question = response.data;
       }
     });
 }

 // Method to fetch answers for a question
 getQuestionAnswers(id: string) {
   return this.http
     .get(`${API_URL}/answer`, {
       params: {
         questionId: id,
       },
     })
     .subscribe((response: any) => {
       if (response) {
         this.answers = response.data;
       }
     });
 }

 // Method to upvote or downvote an answer
 upvoteOrDownvote(id: string, action: string) {
   this.http
     .post(`${API_URL}/answer/upvote/${id}`, {
       action,
     })
     .subscribe(() => {
       this.getQuestionAnswers(this.questionId); // Refresh answers after voting
     });
 }

 // Lifecycle hook - executed when component is initialized
 ngOnInit(): void {
   this.route.params.subscribe((params) => {
     this.questionId = params['id']; // Get question ID from route parameters
     this.getQuestionDetails(this.questionId); // Fetch question details
     this.getQuestionAnswers(this.questionId); // Fetch answers for the question
   });
 }
}
