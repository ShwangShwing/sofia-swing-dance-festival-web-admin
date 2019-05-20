import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  error = '';
  email: string;
  password: string;

  private userSubscription: Subscription;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.userSubscription = this.authService.getLoggedUser().subscribe(loggedUser => {
      if (loggedUser && loggedUser.uid) {
        this.router.navigate(['public/home']);
      }
    });
  }

  onSubmit(formData) {
    this.authService.login(formData.value.email, formData.value.password)
      .then(() => {
        this.error = '';
        this.router.navigate(['public/home']);
      })
      .catch(() => {
        this.error = 'Error logging in!';
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
