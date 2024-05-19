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
  questions: any = []; // Array to store fetched questions

  searchInput = new FormControl(''); // FormControl for search input

  constructor(private http: HttpClient, private router: Router) {
    this.http = http;
    this.router = router;
    
    // Fetch initial list of questions (empty query)
    this.getQuestions({ q: '' }).subscribe((response: any) => {
      this.questions = response.data; // Assign fetched questions to the array
    });
  }

  // Method to navigate to a specific question
  navigateToQuestion(questionId: number): void {
    this.router.navigate(['/question', questionId]);
  }

  ngOnInit(): void {
    // Subscribe to changes in the search input
    this.searchInput.valueChanges
      .pipe(
        debounceTime(300), // Debounce user input for 300 milliseconds
        distinctUntilChanged(), // Only emit distinct values
        switchMap((query) => this.getQuestions({ q: query || '' })) // Switch to new observable based on search query
      )
      .subscribe((response: any) => {
        this.questions = response.data; // Update questions array with filtered questions
      });
  }

  // Method to convert a date string to relative time
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

  // Method to fetch questions from the API
  getQuestions({ q }: { q: string }) {
    return this.http.get(`${API_URL}/question`, {
      params: { q }, // Pass search query as a parameter
    });
  }
}
