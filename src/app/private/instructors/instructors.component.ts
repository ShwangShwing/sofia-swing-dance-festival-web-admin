import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { InstructorModel } from '../../models/instructor.model';
import { InstructorsService } from '../../services/data/instructors.service';
import { UploadService } from '../../services/data/upload-service.service';

@Component({
  selector: 'app-instructors',
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.css']
})
export class InstructorsComponent implements OnInit {
  instructors$: Observable<InstructorModel[]>;
  deleteId: string;
  newEditInstructorName: string;
  newEditInstructorImageUrl: string;
  newEditInstructorDescription: string;
  newEditInstructorType: string;
  newEditInstructorPosition: number;
  editId = '';
  isUploadingPicture = false;

  constructor(private dataService: InstructorsService,
    private uploadService: UploadService) { }

  ngOnInit() {
    this.instructors$ = this.dataService.getAll();
    this.resetNewEdit();
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
    this.newEditInstructorName = '';
    this.newEditInstructorImageUrl = '';
    this.newEditInstructorDescription = '';
    this.newEditInstructorType = 'main';
    this.newEditInstructorPosition = 0;
    this.editId = '';
  }

  create(): void {
    const instructor: InstructorModel = {
      name: this.newEditInstructorName,
      imageUrl: this.newEditInstructorImageUrl,
      description: this.newEditInstructorDescription,
      type: this.newEditInstructorType,
      position: this.newEditInstructorPosition | 0
    };

    this.dataService.insert(instructor);

    this.resetNewEdit();
  }

  edit(editedModel: InstructorModel): void {
    this.editId = editedModel.id;
    this.newEditInstructorName = editedModel.name;
    this.newEditInstructorImageUrl = editedModel.imageUrl;
    this.newEditInstructorDescription = editedModel.description;
    this.newEditInstructorType = editedModel.type;
    this.newEditInstructorPosition = editedModel.position;
  }

  update(): void {
    const newInstructor: InstructorModel = {
      id: this.editId,
      imageUrl: this.newEditInstructorImageUrl,
      name: this.newEditInstructorName,
      description: this.newEditInstructorImageUrl,
      type: this.newEditInstructorType,
      position: this.newEditInstructorPosition | 0
    };

    this.dataService.update(newInstructor);

    this.resetNewEdit();
  }

  fileChanged(e: Event) {
    const target: HTMLInputElement = e.target as HTMLInputElement;
    const file = target.files[0];

    const picIdentHelper = this.newEditInstructorName.toLowerCase().replace(/[^0-9a-z]/gi, '');

    this.isUploadingPicture = true;
    this.uploadService.uploadInstructorPicture(
      `${picIdentHelper}-${Math.random() * 0x10000 | 0}`,
      file)
      .then(picUrl => {
        this.newEditInstructorImageUrl = picUrl;
        this.isUploadingPicture = false;
      });
  }
}
