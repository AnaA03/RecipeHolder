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
    const returnTo = localStorage.getItem('returnTo');
    const currentUrl = this.router.url;

    if (returnTo && returnTo !== currentUrl) {
      console.log('[Redirect] Returning to saved route:', returnTo);

      // Delay ensures router is initialized properly on app load
      setTimeout(() => {
        this.router.navigateByUrl(returnTo).then(success => {
          if (success) {
            console.log('[Redirect] Navigation successful, clearing returnTo.');
            localStorage.removeItem('returnTo');
          } else {
            console.warn('[Redirect] Navigation failed, keeping returnTo.');
          }
        }).catch(err => {
          console.error('[Redirect] Navigation error:', err);
        });
      }, 100);
    }
  }
}

