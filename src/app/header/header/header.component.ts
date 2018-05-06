import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { AuthService } from '../../services/auth.service';
import { SsdfYearsService } from '../../services/data/ssdf-years.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  firebaseUser$: Observable<firebase.User> = null;
  ssdfYears$: Observable<string[]> = null;
  activeSsdfYear = '';
  selectedSsdfYear = '';

  constructor(private authService: AuthService,
    private ssdfYearsService: SsdfYearsService) { }

  ngOnInit() {
    this.firebaseUser$ = this.authService.getLoggedUser();
    this.ssdfYears$ = this.ssdfYearsService.getAll();
    this.ssdfYearsService.getActiveSsdfYear()
      .subscribe(activeSsdfYear => {
        this.activeSsdfYear = activeSsdfYear;
      });
    this.ssdfYearsService.getSelectedSsdfYear()
      .subscribe(selectedSsdfYear => {
        this.selectedSsdfYear = selectedSsdfYear;
      });
  }

  onChangeSelectedSsdfYear(newSsdfYear: string) {
    this.ssdfYearsService.setSelectedSsdfYear(newSsdfYear);
  }
}
