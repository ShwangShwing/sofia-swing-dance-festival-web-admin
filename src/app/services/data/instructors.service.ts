import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, first } from 'rxjs/operators';
import { InstructorModel } from '../../models/instructor.model';
import { AngularFireDatabase } from '@angular/fire/database';
import { SsdfYearsService } from './ssdf-years.service';


@Injectable()
export class InstructorsService {
  private instructors = new BehaviorSubject<InstructorModel[]>([]);
  constructor(private af: AngularFireDatabase,
    private ssdfYearsService: SsdfYearsService) {
      this.ssdfYearsService.getSelectedSsdfYear()
        .pipe(switchMap(ssdfYear => {
          return this.af
          .list(`/${ssdfYear}/instructors`)
          .snapshotChanges().pipe(map(dbInstructors => ({ssdfYear, dbInstructors})));
        }))
        .subscribe(({ssdfYear, dbInstructors}) => {
          const outInstructors: InstructorModel[] = [];
          dbInstructors.forEach(dbInstructor => {
            const inDbInstructor: any = dbInstructor.payload.val();
            const instructor: InstructorModel = {
              id: `${ssdfYear}/instructors/${dbInstructor.key}`,
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
  }

  getAll() {
    return this.instructors;
  }

  delete(id): void {
    this.af.object(id).remove();
  }

  insert(instructor: InstructorModel): void {
    const instructorIdentifier = instructor.name.toLowerCase().replace(/[^0-9a-z]/gi, '');
    this.ssdfYearsService.getSelectedSsdfYear().pipe(first())
    .subscribe(ssdfYear => {
      this.af.object(`/${ssdfYear}/instructors/${instructorIdentifier}`).set(instructor);
    });
  }

  update(instructor: InstructorModel): void {
    this.af.object(`${instructor.id}/name`).set(instructor.name);
    this.af.object(`${instructor.id}/imageUrl`).set(instructor.imageUrl);
    this.af.object(`${instructor.id}/description`).set(instructor.description);
    this.af.object(`${instructor.id}/type`).set(instructor.type);
    this.af.object(`${instructor.id}/position`).set(instructor.position | 0);
  }
}
