import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { SsdfYearsService } from './ssdf-years.service';

@Injectable()
export class UploadService {
  private selectedSsdfYear = '';

  constructor(private ssdfYearService: SsdfYearsService) {
    ssdfYearService.getSelectedSsdfYear().subscribe(s => this.selectedSsdfYear = s);
  }

  uploadInstructorPicture(filename: string, file: File): Promise<string> {
    return this.upload(`instructors/${this.selectedSsdfYear}/${filename}`, file);
  }

  uploadVenuePicture(filename: string, file: File): Promise<string> {
    return this.upload(`venues/${this.selectedSsdfYear}/${filename}`, file);
  }

  private upload(filename: string, file: File): Promise<string> {
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(filename);

    return fileRef.put(file)
        .then(snapshot => snapshot.ref.getDownloadURL());
  }
}
