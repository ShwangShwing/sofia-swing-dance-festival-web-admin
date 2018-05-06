import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth.service';
import { SsdfYearsService } from '../../services/data/ssdf-years.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-set-ssdf-year',
  templateUrl: './set-ssdf-year.component.html',
  styleUrls: ['./set-ssdf-year.component.css']
})
export class SetSsdfYearComponent implements OnInit {
  ssdfYears$: Observable<string[]> = null;
  activeSsdfYear = '';
  selectedActiveSsdfYear = '';

  constructor(private authService: AuthService,
    private ssdfYearsService: SsdfYearsService) { }

  ngOnInit() {
    this.ssdfYears$ = this.ssdfYearsService.getAll();

    this.ssdfYears$.subscribe(() => {
      this.ssdfYearsService.getActiveSsdfYear()
      .subscribe(activeSsdfYear => {
        this.activeSsdfYear = activeSsdfYear;
        if (this.selectedActiveSsdfYear === '') {
          this.selectedActiveSsdfYear = this.selectedActiveSsdfYear;
          this.selectedActiveSsdfYear = 'dev2018';
        }
      });
    });
  }

  onSubmit(formData: NgForm): void {
    this.ssdfYearsService.setActiveSsdfYear(formData.value['active-ssdf-year']);
  }
}
