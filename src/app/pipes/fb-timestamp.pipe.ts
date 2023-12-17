import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import firebase from 'firebase/compat/app';

@Pipe({
  name: 'fbTimestamp'
})
export class FbTimestampPipe implements PipeTransform {

    constructor(private datePipe: DatePipe) {}
  
    transform(value: any) {
      if (!value || typeof value !== 'object') {
        return '';
      }
  
      if ('seconds' in value && 'nanoseconds' in value) {
        const seconds = value.seconds;
        const milliseconds = value.nanoseconds / 1e6; // Convert nanoseconds to milliseconds
        const timestamp = new Date(seconds * 1000 + milliseconds);
        return this.datePipe.transform(timestamp, 'mediumDate');
      }
  
      return '';
    }
  
  








  /*
  constructor(private datePipe: DatePipe) {}

//value: firebase.firestore.FieldValue
  transform(value:Date | undefined) {
    if(!value) {
      return ''
    }

    //const date = value.toDate()
    
    return this.datePipe.transform(value, 'mediumDate');
  }
*/
}
