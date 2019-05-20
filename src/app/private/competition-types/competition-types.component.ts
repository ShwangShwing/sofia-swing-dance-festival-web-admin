import { Component, OnInit } from '@angular/core';
import { CompetitionTypeModel } from '../../models/competition-type.model';
import { CompetitionTypesService } from '../../services/data/competition-type.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-competition-types',
  templateUrl: './competition-types.component.html',
  styleUrls: ['./competition-types.component.css']
})
export class CompetitionTypesComponent implements OnInit {
  competitionTypes$: Observable<CompetitionTypeModel[]>;
  deleteId: string;
  newEditCompetitionTypeName: string;
  newEditCompetitionTypePosition: number;
  editId = '';

  constructor(private dataService: CompetitionTypesService) { }

  ngOnInit() {
    this.competitionTypes$ = this.dataService.getAll();
  }

  setForDeletion(id: string) {
    this.deleteId = id;
  }

  delete(): void {
    this.dataService.delete(this.deleteId);
    this.deleteId = null;
  }

  cancelDeletion(): void {
    this.deleteId = null;
  }

  resetNewEdit(): void {
    this.newEditCompetitionTypeName = '';
    this.newEditCompetitionTypePosition = 0;
    this.editId = '';
  }

  create(): void {
    const competitionType: CompetitionTypeModel = {
      name: this.newEditCompetitionTypeName,
      position: this.newEditCompetitionTypePosition | 0
    };

    this.dataService.insert(competitionType);

    this.resetNewEdit();
  }

  edit(editedModel: CompetitionTypeModel): void {
    this.editId = editedModel.id;
    this.newEditCompetitionTypeName = editedModel.name;
    this.newEditCompetitionTypePosition = editedModel.position | 0;
  }

  update(): void {
    const newCompetitionType: CompetitionTypeModel = {
      id: this.editId,
      name: this.newEditCompetitionTypeName,
      position: this.newEditCompetitionTypePosition | 0
    };

    this.dataService.update(newCompetitionType);

    this.resetNewEdit();
  }
}
