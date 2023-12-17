import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class TimestampService {
    //created by myself to eliminate timestamp issue(firebase not accepting ->  firebase.firestore.FieldValue.serverTimestamp())
    constructor() {}

    options:object = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
        timeZone: 'UTC',
        hour12: true,
    };

    dateFormatter(){
        const currentDate = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', this.options);
        const formattedDate = formatter.format(currentDate);
        return formattedDate;
      }
  }
  