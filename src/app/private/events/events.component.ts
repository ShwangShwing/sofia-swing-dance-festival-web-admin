import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/data/events.service';
import { EventModel } from '../../models/event.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events$: Observable<EventModel[]>;
  eventTypeFilter = '';
  deleteId: string;
  editId = '';

  constructor(private dataService: EventsService) { }

  ngOnInit() {
    this.events$ = this.dataService.getAll();
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
    this.editId = '';
  }

  create(): void {


    // this.dataService.insert(event);

    this.resetNewEdit();
  }

  edit(editedModel: EventModel): void {
    this.editId = editedModel.id;
    // create appropriate type event
  }

  update(): void {
    // const newEvent: EventModel = {
    //   id: this.editId,
    //   name: this.newEditVenueName,
    //   imageUrl: this.newEditVenueImageUrl,
    //   youtubeUrl: this.newEditVenueYoutubeUrl,
    //   address: this.newEditVenueAddress,
    //   latitude: +this.newEditVenueLatitude || 0,
    //   longitude: +this.newEditVenueLongitude || 0,
    //   position: this.newEditVenuePosition | 0
    // };

    // this.dataService.update(newEvent);

    this.resetNewEdit();
  }
}
