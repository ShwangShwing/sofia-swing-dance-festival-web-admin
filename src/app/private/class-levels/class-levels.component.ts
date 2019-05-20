import { Component, OnInit } from '@angular/core';
import { ClassLevelModel } from '../../models/class-level.model';
import { ClassLevelsService } from '../../services/data/class-levels.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-class-levels',
  templateUrl: './class-levels.component.html',
  styleUrls: ['./class-levels.component.css']
})
export class ClassLevelsComponent implements OnInit {
  classLevels$: Observable<ClassLevelModel[]>;
  deleteId: string;
  newEditClassLevelName: string;
  newEditClassLevelPosition: number;
  editId = '';

  constructor(private dataService: ClassLevelsService) { }

  ngOnInit() {
    this.classLevels$ = this.dataService.getAll();
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
    this.newEditClassLevelName = '';
    this.newEditClassLevelPosition = 0;
    this.editId = '';
  }

  create(): void {
    const classLevel: ClassLevelModel = {
      name: this.newEditClassLevelName,
      position: this.newEditClassLevelPosition | 0
    };

    this.dataService.insert(classLevel);

    this.resetNewEdit();
  }

  edit(editedModel: ClassLevelModel): void {
    this.editId = editedModel.id;
    this.newEditClassLevelName = editedModel.name;
    this.newEditClassLevelPosition = editedModel.position | 0;
  }

  update(): void {
    const newClassLevel: ClassLevelModel = {
      id: this.editId,
      name: this.newEditClassLevelName,
      position: this.newEditClassLevelPosition | 0
    };

    this.dataService.update(newClassLevel);

    this.resetNewEdit();
  }
}
