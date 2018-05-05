import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  firebaseUser$: Observable<firebase.User> = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.firebaseUser$ = this.authService.getLoggedUser();
  }
}
