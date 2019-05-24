import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { EventsService } from '../../services/data/events.service';
import { EventModel } from '../../models/event.model';
import { Observable } from 'rxjs';
import { ClassLevelsService } from '../../services/data/class-levels.service';
import { VenuesService } from '../../services/data/venues.service';
import { ClassLevelModel } from '../../models/class-level.model';
import { VenueModel } from '../../models/venue.model';
import { Subscription } from 'rxjs';
import { InstructorModel } from '../../models/instructor.model';
import { InstructorsService } from '../../services/data/instructors.service';
import { CompetitionTypeModel } from '../../models/competition-type.model';
import { CompetitionTypesService } from '../../services/data/competition-type.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, OnDestroy {
  events$: Observable<EventModel[]>;
  classLevels$: Observable<ClassLevelModel[]>;
  classLevels: { [classLevelType: string]: ClassLevelModel } = {};
  competitionTypes$: Observable<CompetitionTypeModel[]>;
  competitionTypes: { [competitionType: string]: CompetitionTypeModel } = {};
  venues$: Observable<VenueModel[]>;
  venues: { [venueId: string]: VenueModel };
  instructors$: Observable<InstructorModel[]>;
  instructors: { [instructorId: string]: InstructorModel } = {};
  eventTypeFilter = '';
  classLevelFilter = '';
  deleteId: string;
  editId = '';
  newEditEventType = 'class';
  newEditEventName: string;
  newEditEventDescription: string;
  newEditStartTime: Date;
  newEditEndTime: Date;
  newEditVenueId: string;
  newEditClassLevel: string;
  newEditCompetitionType: string;
  newEditInstructors: InstructorModel[];

  dateLocale: any;

  private eventsSubscr = new Subscription();

  constructor(
    private dataService: EventsService,
    private classLevelsService: ClassLevelsService,
    private competitionTypesService: CompetitionTypesService,
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
    this.competitionTypes$ = this.competitionTypesService.getAll();
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
      this.competitionTypes$.subscribe(competitionTypes => {
        this.competitionTypes = {};
        competitionTypes.forEach(competitionType => {
          this.competitionTypes[competitionType.competitionType] = competitionType;
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

  stringToColour(str: string): string {
    let hash = 0;
    for (var i = 0; i < str.length; i++) {
        let character = str.charCodeAt(i);
        hash = ((hash<<5) - hash) + character;
        hash = hash & hash; // Convert to 32bit integer
    }

    let colour = '#';
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    colour += '22' // transperancy
    return colour;
  }

  getEventTypeHumanString(eventType: string): string {
    if (eventType.startsWith('class_')) {
      const classLevel = eventType.substr('class_'.length);
      const classLevelName = this.classLevels[classLevel] ? this.classLevels[classLevel].name : '';
      return `Class ${classLevelName}`;
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

  getCompetitionType(eventType: string): string {
    if (eventType.startsWith('competition_')) {
      const competitionType = eventType.substr('competition_'.length);
      return `${competitionType}`;
    }

    return '';
  }

  getEventTypePreffix(eventType: string): string {
    if (eventType.startsWith('class_')) {
      return 'class';
    }

    if (eventType.startsWith('competition_')) {
      return 'competition';
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
    this.newEditEventDescription = '';
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
      description: this.newEditEventDescription,
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
    } else if (eventType.startsWith('competition')) {
      newEvent.competitionType = this.newEditCompetitionType;
      this.dataService.insertCompetition(newEvent);
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
    this.newEditEventDescription = editedModel.description;
    this.newEditStartTime = new Date(editedModel.startTime * 1000);
    this.newEditEndTime = new Date(editedModel.endTime * 1000);
    this.newEditVenueId = editedModel.venueId;
    this.newEditClassLevel = '';
    if (this.newEditEventType === 'class') {
      this.newEditClassLevel = this.getClassLevel(editedModel.type);
    }

    if (this.newEditEventType === 'competition') {
      this.newEditCompetitionType = this.getCompetitionType(editedModel.type);
    }

    this.newEditInstructors = [];
    if (this.newEditEventType === 'class') {
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
      description: this.newEditEventDescription,
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
    } else if (eventType.startsWith('competition')) {
      newEvent.competitionType = this.newEditCompetitionType;
      this.dataService.updateCompetition(newEvent);
    } else if (eventType.startsWith('party')) {
      this.dataService.updateParty(newEvent);
    } else {
      this.dataService.updateMisc(newEvent);
    }

    this.resetNewEdit();
  }

  shouldShowEventByFilter(eventType: string, eventTypeFilter: string, classLevelFilter: string = ''): boolean {
    let shouldShow = eventType.startsWith(eventTypeFilter);
    if (eventTypeFilter === 'class') {
      shouldShow = shouldShow && eventType.endsWith(classLevelFilter);
    }

    return shouldShow;
  }
}
