import { Component, OnInit } from '@angular/core';
import { VenueModel } from '../../models/venue.model';
import { Observable } from 'rxjs/Observable';
import { VenuesService } from '../../services/data/venues.service';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.css']
})
export class VenuesComponent implements OnInit {
  venues$: Observable<VenueModel[]>;
  deleteId: string;
  newEditVenueName: string;
  newEditVenueImageUrl: string;
  newEditVenueYoutubeUrl: string;
  newEditVenueAddress: string;
  newEditVenueLatitude: number;
  newEditVenueLongitude: number;
  newEditVenuePosition: number;
  editId = '';

  constructor(private dataService: VenuesService) { }

  ngOnInit() {
    this.venues$ = this.dataService.getAll();
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
    this.newEditVenueName = '';
    this.newEditVenueImageUrl = '';
    this.newEditVenueYoutubeUrl = '';
    this.newEditVenueAddress = '';
    this.newEditVenueLatitude = 0;
    this.newEditVenueLongitude = 0;
    this.newEditVenuePosition = 0;
    this.editId = '';
  }

  create(): void {
    const venue: VenueModel = {
      name: this.newEditVenueName,
      imageUrl: this.newEditVenueImageUrl,
      youtubeUrl: this.newEditVenueYoutubeUrl,
      address: this.newEditVenueAddress,
      latitude: +this.newEditVenueLatitude || 0,
      longitude: +this.newEditVenueLongitude || 0,
      position: this.newEditVenuePosition | 0
    };

    this.dataService.insert(venue);

    this.resetNewEdit();
  }

  edit(editedModel: VenueModel): void {
    this.editId = editedModel.id;
    this.newEditVenueName = editedModel.name;
    this.newEditVenueImageUrl = editedModel.imageUrl;
    this.newEditVenueYoutubeUrl = editedModel.youtubeUrl;
    this.newEditVenueAddress = editedModel.address;
    this.newEditVenueLatitude = editedModel.latitude;
    this.newEditVenueLongitude = editedModel.longitude;
    this.newEditVenuePosition = editedModel.position;
  }

  update(): void {
    const newVenue: VenueModel = {
      id: this.editId,
      name: this.newEditVenueName,
      imageUrl: this.newEditVenueImageUrl,
      youtubeUrl: this.newEditVenueYoutubeUrl,
      address: this.newEditVenueAddress,
      latitude: +this.newEditVenueLatitude || 0,
      longitude: +this.newEditVenueLongitude || 0,
      position: this.newEditVenuePosition | 0
    };

    this.dataService.update(newVenue);

    this.resetNewEdit();
  }
}
