import { Routes } from '@angular/router';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { QuestionComponent } from './question/question.component';
import { QuestionsComponent } from './questions/questions.component';
import { routeGuard } from './route.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'createPost',
    component: CreatePostComponent,
    canActivate: [routeGuard],
  },
  {
    path: 'questions',
    component: QuestionsComponent,
    canActivate: [routeGuard],
  },
  {
    path: 'question/:id',
    component: QuestionComponent,
    canActivate: [routeGuard],
  },
];
