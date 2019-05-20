import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  firebaseUser$: Observable<firebase.User> = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.firebaseUser$ = this.authService.getLoggedUser();
  }

}
