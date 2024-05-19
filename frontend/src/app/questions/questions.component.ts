import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { API_URL } from '../../constants';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgFor],
  templateUrl: './questions.component.html',
})
export class QuestionsComponent {
  questions: any = [];

  searchInput = new FormControl('');

  constructor(private http: HttpClient, private router: Router) {
    this.http = http;
    this.router = router;
    this.getQuestions({ q: '' }).subscribe((response: any) => {
      this.questions = response.data; // Adjust based on your API response
    });
  }

  navigateToQuestion(questionId: number): void {
    this.router.navigate(['/question', questionId]);
  }

  ngOnInit(): void {
    this.searchInput.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => this.getQuestions({ q: query || '' }))
      )
      .subscribe((response: any) => {
        this.questions = response.data;
      });
  }

  getRelativeTime(date: string) {
    const now = new Date();
    const inputDate = new Date(date);
    const seconds = Math.floor((now.valueOf() - inputDate.valueOf()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval === 1 ? '1 year ago' : `${interval} years ago`;
    }

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval === 1 ? '1 month ago' : `${interval} months ago`;
    }

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? '1 day ago' : `${interval} days ago`;
    }

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
    }

    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
    }

    return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
  }

  getQuestions({ q }: { q: string }) {
    return this.http.get(`${API_URL}/question`, {
      params: { q },
    });
  }
}
