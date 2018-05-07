import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth.service';

@Injectable()
export class SsdfYearsService {
  private selectedSsdfYear$ = new BehaviorSubject<string>('');
  private isSelectedSsdfYearInit = false;

  constructor(private af: AngularFireDatabase, private authService: AuthService) {
    this.af.object<string>('/activeSsdfYear').valueChanges().subscribe(activeSsdfYear => {
      if (!this.isSelectedSsdfYearInit) {
        this.selectedSsdfYear$.next(activeSsdfYear);
        this.isSelectedSsdfYearInit = true;
      }
    });
   }

  getAll(): Observable<string[]> {
    return this.af.list('/').snapshotChanges()
      .map((ssdfYears) => {
        return ssdfYears.map(ssdfYear => ssdfYear.key)
        .filter(ssdfYear => ssdfYear !== 'activeSsdfYear')
        .sort((left, right) => right > left ? 1 : 0);
      });
  }

  getSelectedSsdfYear(): Observable<string> {
    return this.selectedSsdfYear$;
  }

  getActiveSsdfYear(): Observable<string> {
    return this.af.object<string>('/activeSsdfYear').valueChanges();
  }

  setSelectedSsdfYear(selectedSsdfYear: string): void {
    this.selectedSsdfYear$.next(selectedSsdfYear);
    this.isSelectedSsdfYearInit = true;
    console.log(selectedSsdfYear);
  }

  setActiveSsdfYear(activeSsdfYear: string): void {
    this.af.object<string>('/activeSsdfYear').set(activeSsdfYear);
  }
}
