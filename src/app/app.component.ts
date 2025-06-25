import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
   constructor(private router: Router) {}

ngOnInit(): void {
    const lastRoute = localStorage.getItem('lastRoute');

    if (lastRoute && this.router.url === '/home') {
      // Only redirect if app restarted at base path
      setTimeout(() => {
        this.router.navigateByUrl(lastRoute!);
        localStorage.removeItem('lastRoute');
      }, 100); // allow Angular init
    }
  }
}

