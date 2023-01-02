import { Component, OnInit } from '@angular/core';
import { AuthService } from './components/shared/auth.service';
import { tap } from 'rxjs/operators';
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
    this.authService.validateTokens().subscribe(
      async (res) => {
        if (!res.success) {
          await this.router.navigate(['/', 'auth', 'login']);
        }
      },
      async () => await this.router.navigate(['/', 'auth', 'login'])
    );
  }
}
