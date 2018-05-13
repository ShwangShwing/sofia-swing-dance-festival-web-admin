import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { InstructorModel } from '../../models/instructor.model';
import { AngularFireDatabase } from 'angularfire2/database';
import { SsdfYearsService } from './ssdf-years.service';
import { Subscription } from 'rxjs/Subscription';


@Injectable()
export class InstructorsService {
  private instructors = new BehaviorSubject<InstructorModel[]>([]);
  private selectedSsdfYear = '';
  constructor(private af: AngularFireDatabase,
    private ssdfYearsService: SsdfYearsService) {
      let InstructorsSubscr = new Subscription();
      this.ssdfYearsService.getSelectedSsdfYear()
        .subscribe(selectedSsdfYear => {
          this.selectedSsdfYear = selectedSsdfYear;
          InstructorsSubscr.unsubscribe();
          InstructorsSubscr = this.af
            .list(`/${this.selectedSsdfYear}/instructors`)
            .snapshotChanges()
            .subscribe(dbInstructors => {
              const outInstructors: InstructorModel[] = [];
              dbInstructors.forEach(dbInstructor => {
                const inDbInstructor = dbInstructor.payload.val();
                const instructor: InstructorModel = {
                  id: `${this.selectedSsdfYear}/instructors/${dbInstructor.key}`,
                  name: inDbInstructor.name || '',
                  imageUrl: inDbInstructor.imageUrl || '',
                  description: inDbInstructor.description,
                  type: inDbInstructor.type,
                  position: inDbInstructor.position || 0
                };
                outInstructors.push(instructor);
              });

              outInstructors.sort((left, right) => left.position - right.position);
              this.instructors.next(outInstructors);
            });
        });
  }

  getAll() {
    return this.instructors;
  }

  delete(id): void {
    this.af.object(id).remove();
  }

  insert(instructor: InstructorModel): void {
    const instructorIdentifier = instructor.name.toLowerCase().replace(/[^0-9a-z]/gi, '');
    this.af.object(`/${this.selectedSsdfYear}/instructors/${instructorIdentifier}`).set(instructor);
  }

  update(instructor: InstructorModel): void {
    this.af.object(`${instructor.id}/name`).set(instructor.name);
    this.af.object(`${instructor.id}/imageUrl`).set(instructor.imageUrl);
    this.af.object(`${instructor.id}/description`).set(instructor.description);
    this.af.object(`${instructor.id}/type`).set(instructor.type);
    this.af.object(`${instructor.id}/position`).set(instructor.position | 0);
  }
}
