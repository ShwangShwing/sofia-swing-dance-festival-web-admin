import { Component, OnInit, OnDestroy } from '@angular/core';
import { SsdfYearsService } from '../../services/data/ssdf-years.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-ssdf-year',
  templateUrl: './new-ssdf-year.component.html',
  styleUrls: ['./new-ssdf-year.component.css']
})
export class NewSsdfYearComponent implements OnInit, OnDestroy {
  ssdfYears: string[] = [];
  activeSsdfYear = '';
  newSsdfYearName = '';
  selectedSsdfYear = '';
  errorMessage = '';

  private subscriptions = new Subscription();

  constructor(private ssdfYearService: SsdfYearsService) { }

  ngOnInit() {
    this.subscriptions.add(this.ssdfYearService.getAll().subscribe(ssdfYears => {
      this.ssdfYears = ['(don\'t copy)'];
      this.ssdfYears.push(...ssdfYears);
    }));

    this.subscriptions.add(this.ssdfYearService.getActiveSsdfYear()
      .subscribe(activeSsdfYear => {
        this.activeSsdfYear = activeSsdfYear;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onCreateClick(): void {
    this.errorMessage = '';
    if (this.newSsdfYearName.length <= 0) {
      this.errorMessage = 'Database name cannot be empty!';
      return;
    }

    if (this.ssdfYears.indexOf(this.newSsdfYearName) >= 0) {
      this.errorMessage = 'Database with such a name exists';
      return;
    }

    if (this.newSsdfYearName === 'activeSsdfYear') {
      this.errorMessage = 'E brato, tochno takova ime li izmisli??';
      return;
    }

    if (this.selectedSsdfYear) {
      this.ssdfYearService.copySsdfYear(this.selectedSsdfYear, this.newSsdfYearName);
    } else {
      this.ssdfYearService.newSsdfYear(this.newSsdfYearName);
    }
  }
}
