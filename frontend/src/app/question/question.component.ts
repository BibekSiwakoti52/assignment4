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

  questionId: string = '';
  question: any;
  answers: any;

  showAnswerForm = false;

  newAnswer = new FormControl('');

  answerForm = new FormGroup({
    newAnswer: this.newAnswer,
  });

  postAnswer(id: string) {
    this.http
      .post(`${API_URL}/answer?questionId=${id}`, {
        answer: this.newAnswer.value,
      })
      .subscribe(
        () => {
          this.getQuestionAnswers(id);
          this.showAnswerForm = false;
          this.newAnswer.setValue('');
        },
        (err) => {
          alert(err.error.message);
        }
      );
  }

  getQuestionDetails(id: string) {
    return this.http
      .get(`${API_URL}/question/${id}`)
      .subscribe((response: any) => {
        if (response) {
          this.question = response.data;
        }
      });
  }

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

  upvoteOrDownvote(id: string, action: string) {
    this.http
      .post(`${API_URL}/answer/upvote/${id}`, {
        action,
      })
      .subscribe(() => {
        this.getQuestionAnswers(this.questionId);
      });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.questionId = params['id'];
      this.getQuestionDetails(this.questionId);
      this.getQuestionAnswers(this.questionId);
    });
  }
}
