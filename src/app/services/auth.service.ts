import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { CanActivate } from '@angular/router';

@Injectable()
export class AuthService implements CanActivate {
  private firebaseUser$: Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth) {
    this.firebaseUser$ = firebaseAuth.authState;
   }

  login(email, password): Promise<any> {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.auth.signInWithEmailAndPassword(email, password)
        .then(() => resolve())
        .catch(error => reject(error));
    });
  }

  logout() {
    return this.firebaseAuth.auth.signOut()
      .then(() => Promise.resolve())
      .catch(() => Promise.resolve());
  }

  getLoggedUser() {
    return this.firebaseUser$;
  }

  canActivate(): Observable<boolean> {
    return this.firebaseUser$.map(user => !!user.uid);
  }
}
