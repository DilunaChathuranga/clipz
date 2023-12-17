import firebase from 'firebase/compat/app';
import { FieldValue, Timestamp } from 'firebase/firestore';

export default  interface IClip{
    docID?: string;
    uid:string;
    displayName:string;
    title:string;
    fileName:string;
    url:string;
    screenshotURL:string;
    //timestamp: firebase.firestore.FieldValue;
    timestamp:Date;
    screenshotFileName: string;
}