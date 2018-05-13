import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EventsService } from '../../services/data/events.service';
import { EventModel } from '../../models/event.model';
import { Observable } from 'rxjs/Observable';
import { ClassLevelsService } from '../../services/data/class-levels.service';
import { VenuesService } from '../../services/data/venues.service';
import { ClassLevelModel } from '../../models/class-level.model';
import { VenueModel } from '../../models/venue.model';
import { Subscription } from 'rxjs/Subscription';
import { InstructorModel } from '../../models/instructor.model';
import { InstructorsService } from '../../services/data/instructors.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, OnDestroy {
  events$: Observable<EventModel[]>;
  classLevels$: Observable<ClassLevelModel[]>;
  classLevels: { [classLevelType: string]: ClassLevelModel } = {};
  venues$: Observable<VenueModel[]>;
  venues: { [venueId: string]: VenueModel };
  instructors$: Observable<InstructorModel[]>;
  instructors: { [instructorId: string]: InstructorModel } = {};
  eventTypeFilter = '';
  deleteId: string;
  editId = '';
  newEditEventType = 'class';
  newEditEventName: string;
  newEditStartTime: Date;
  newEditEndTime: Date;
  newEditVenueId: string;
  newEditClassLevel: string;
  newEditInstructors: InstructorModel[];

  dateLocale: any;

  private eventsSubscr = new Subscription();

  constructor(
    private dataService: EventsService,
    private classLevelsService: ClassLevelsService,
    private venuesService: VenuesService,
    private instructorsServide: InstructorsService) { }

  ngOnInit() {
    this.dateLocale = {
      firstDayOfWeek: 1,
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthNames: [
        'January', 'February', 'March',
        'April', 'May', 'June',
        'July', 'August', 'September',
        'October', 'November', 'December'],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      today: 'Today',
      clear: 'Clear'
    };

    this.events$ = this.dataService.getAll();
    this.classLevels$ = this.classLevelsService.getAll();
    this.venues$ = this.venuesService.getAll();
    this.instructors$ = this.instructorsServide.getAll();

    this.eventsSubscr.add(
      this.classLevels$.subscribe(classLevels => {
        this.classLevels = {};
        classLevels.forEach(classLevel => {
          this.classLevels[classLevel.classLevelType] = classLevel;
        });
      })
    );

    this.eventsSubscr.add(
      this.venues$.subscribe(venues => {
        this.venues = {};
        venues.forEach(venue => {
          this.venues[venue.id] = venue;
        });
      })
    );

    this.eventsSubscr.add(
      this.instructors$.subscribe(instructors => {
        this.instructors = {};
        instructors.forEach(instructor => {
          this.instructors[instructor.id] = instructor;
        });
      })
    );

    this.resetNewEdit();
  }

  ngOnDestroy(): void {
    this.eventsSubscr.unsubscribe();
  }

  getEventTypeHumanString(eventType: string): string {
    if (eventType.startsWith('class_')) {
      const classLevel = eventType.substr('class_'.length);
      const classLevelName = this.classLevels[classLevel] ? this.classLevels[classLevel].name : '';
      return `Class ${classLevelName}`;
    } else if (eventType.startsWith('taster_class')) {
      return 'Taster class';
    } else if (eventType.startsWith('party')) {
      return 'Party';
    } else {
      return 'Misc';
    }
  }

  getClassLevel(eventType: string): string {
    if (eventType.startsWith('class_')) {
      const classLevel = eventType.substr('class_'.length);
      return `${classLevel}`;
    }

    return '';
  }

  getEventTypePreffix(eventType: string): string {
    if (eventType.startsWith('class_')) {
      return 'class';
    }

    return eventType.slice();
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

    this.newEditEventType = 'class';
    this.newEditEventName = '';
    this.newEditStartTime = new Date();
    this.newEditEndTime = new Date();
    this.newEditVenueId = '';
    this.newEditClassLevel = '';
    this.newEditInstructors = [];
  }

  create(): void {
    let eventType = 'misc';
    if (this.newEditEventType === 'class') {
      eventType = `class_${this.newEditClassLevel}`;
    } else {
      eventType = this.newEditEventType;
    }

    const newEvent: EventModel = {
      id: this.editId,
      name: this.newEditEventName,
      startTime: this.newEditStartTime.getTime() / 1000,
      endTime: this.newEditEndTime.getTime() / 1000,
      venueId: this.newEditVenueId,
      type: eventType
    };

    const fillInstructors = (event: EventModel, instructors: InstructorModel[]) => {
      event.instructorIds = [];
      instructors.forEach(instructor => event.instructorIds.push(instructor.id));
    };

    if (eventType.startsWith('class')) {
      newEvent.classLevel = this.newEditClassLevel;
      fillInstructors(newEvent, this.newEditInstructors);
      this.dataService.insertClass(newEvent);
    } else if (eventType.startsWith('taster_class')) {
      fillInstructors(newEvent, this.newEditInstructors);
      this.dataService.insertTasterClass(newEvent);
    } else if (eventType.startsWith('party')) {
      this.dataService.insertParty(newEvent);
    } else {
      this.dataService.insertMisc(newEvent);
    }

    this.resetNewEdit();
  }

  edit(editedModel: EventModel): void {
    this.editId = editedModel.id;
    this.newEditEventType = this.getEventTypePreffix(editedModel.type);
    this.newEditEventName = editedModel.name;
    this.newEditStartTime = new Date(editedModel.startTime * 1000);
    this.newEditEndTime = new Date(editedModel.endTime * 1000);
    this.newEditVenueId = editedModel.venueId;
    this.newEditClassLevel = '';
    if (this.newEditEventType === 'class') {
      this.newEditClassLevel = this.getClassLevel(editedModel.type);
    }

    this.newEditInstructors = [];
    if (this.newEditEventType === 'class' || this.newEditEventType === 'taster_class') {
      editedModel.instructorIds.forEach(instructorId => {
        this.newEditInstructors.push(this.instructors[instructorId]);
      });
    }
  }

  update(): void {
    let eventType = 'misc';
    if (this.newEditEventType === 'class') {
      eventType = `class_${this.newEditClassLevel}`;
    } else {
      eventType = this.newEditEventType;
    }

    const newEvent: EventModel = {
      id: this.editId,
      name: this.newEditEventName,
      startTime: this.newEditStartTime.getTime() / 1000,
      endTime: this.newEditEndTime.getTime() / 1000,
      venueId: this.newEditVenueId,
      type: eventType
    };

    const fillInstructors = (event: EventModel, instructors: InstructorModel[]) => {
      event.instructorIds = [];
      instructors.forEach(instructor => event.instructorIds.push(instructor.id));
    };

    if (eventType.startsWith('class')) {
      newEvent.classLevel = this.newEditClassLevel;
      fillInstructors(newEvent, this.newEditInstructors);
      this.dataService.updateClass(newEvent);
    } else if (eventType.startsWith('taster_class')) {
      fillInstructors(newEvent, this.newEditInstructors);
      this.dataService.updateTasterClass(newEvent);
    } else if (eventType.startsWith('party')) {
      this.dataService.updateParty(newEvent);
    } else {
      this.dataService.updateMisc(newEvent);
    }

    this.resetNewEdit();
  }
}
