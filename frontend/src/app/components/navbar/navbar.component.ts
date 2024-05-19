import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(private router: Router) {
    this.router = router; // Initializing Router instance
  }

  // Method to handle logout functionality
  logout() {
    localStorage.removeItem('jwtToken'); // Removing JWT token from local storage
    this.router.navigate(['/login']); // Navigating to '/login' route upon logout
  }
}
