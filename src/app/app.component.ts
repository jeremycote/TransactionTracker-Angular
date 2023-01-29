import { Component, OnInit } from '@angular/core';
import { AuthService } from './components/shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'transactions-angular';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.authService.validateTokens().subscribe(
        async (res) => {
          if (!res.success) {
            this.authService.clearUser();
            await this.router.navigate(['/', 'auth', 'login']);
          }
        },
        async () => {
          this.authService.clearUser();
          await this.router.navigate(['/', 'auth', 'login']);
        }
      );
    }
  }
}
