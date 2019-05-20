import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SsdfYearsService } from '../../services/data/ssdf-years.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-set-ssdf-year',
  templateUrl: './set-ssdf-year.component.html',
  styleUrls: ['./set-ssdf-year.component.css']
})
export class SetSsdfYearComponent implements OnInit, OnDestroy {
  ssdfYears$: Observable<string[]> = null;
  activeSsdfYear = '';
  selectedActiveSsdfYear = '';

  private subscriptions = new Subscription();

  constructor(private cd: ChangeDetectorRef,
    private authService: AuthService,
    private ssdfYearsService: SsdfYearsService) { }

  ngOnInit() {
    this.ssdfYears$ = this.ssdfYearsService.getAll();

    this.subscriptions.add(this.ssdfYears$.subscribe(() => {
      this.cd.detectChanges();
      if (this.selectedActiveSsdfYear === '') {
        this.selectedActiveSsdfYear = this.activeSsdfYear;
      }
    }));


    this.subscriptions.add(this.ssdfYearsService.getActiveSsdfYear()
    .subscribe(activeSsdfYear => {
      this.activeSsdfYear = activeSsdfYear;
      if (this.selectedActiveSsdfYear === '') {
        this.selectedActiveSsdfYear = this.activeSsdfYear;
      }

      this.cd.detectChanges();
    }));
  }

  onSubmit(formData: NgForm): void {
    this.ssdfYearsService.setActiveSsdfYear(formData.value['active-ssdf-year']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
