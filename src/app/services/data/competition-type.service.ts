import { Injectable } from '@angular/core';
import { CompetitionTypeModel } from '../../models/competition-type.model';
import { Observable } from 'rxjs/Observable';
import { map, switchMap, first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireDatabase } from 'angularfire2/database';
import { SsdfYearsService } from './ssdf-years.service';

@Injectable()
export class CompetitionTypesService {
  private competitionTypes$ = new BehaviorSubject<CompetitionTypeModel[]>([]);
  constructor(private af: AngularFireDatabase,
    private ssdfYearsService: SsdfYearsService) {
      this.ssdfYearsService.getSelectedSsdfYear()
        .switchMap(ssdfYear => {
          return this.af.list(`/${ssdfYear}/competitionTypes`)
            .snapshotChanges().map(dbCompetitionTypes => ({ ssdfYear, dbCompetitionTypes }));
        }).subscribe(({ssdfYear, dbCompetitionTypes}) => {
          const outCompetitionTypes: CompetitionTypeModel[] = [];
          dbCompetitionTypes.forEach(dbCompetitionType => {
            const inDbCompetitionType = dbCompetitionType.payload.val();
            const competitionType: CompetitionTypeModel = {
              id: `${ssdfYear}/competitionTypes/${dbCompetitionType.key}`,
              competitionType: dbCompetitionType.key,
              name: inDbCompetitionType.name || '',
              position: inDbCompetitionType.position || 0
            };
            outCompetitionTypes.push(competitionType);
          });

          outCompetitionTypes.sort((left, right) => left.position - right.position);
          this.competitionTypes$.next(outCompetitionTypes);
        });
  }

  getAll() {
    return this.competitionTypes$;
  }

  delete(id: string): void {
    this.af.object(id).remove();
  }

  insert(competitionType: CompetitionTypeModel): void {
    const competitionTypeIdentifier = competitionType.name.toLowerCase().replace(/[^0-9a-z]/gi, '');
    if (!competitionType) {
      throw new Error('Put more valid name!');
    }

    this.ssdfYearsService.getSelectedSsdfYear().first()
    .subscribe(ssdfYear => {
      this.af.object(`/${ssdfYear}/competitionTypes/${competitionTypeIdentifier}`).set(competitionType);
    });
  }

  update(competitionType: CompetitionTypeModel): void {
    this.af.object(`${competitionType.id}/name`).set(competitionType.name);
    this.af.object(`${competitionType.id}/position`).set(competitionType.position | 0);
  }
}
