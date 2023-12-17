import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, forkJoin, last, switchMap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { TimestampService } from 'src/app/services/timestamp.service';
import { Timestamp } from 'firebase/firestore';
import { FfmpegService } from 'src/app/services/ffmpeg.service';





@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
isDragover=false;
file:File | null =null;
nextStep=false;
showAlert=false;
alertColor='blue';
alertMsg='Please wait! your clip is being uploaded';
inSubmission=false;
percentage=0;
showPercentage=false;
user:firebase.User | null=null;
task?: AngularFireUploadTask;
screenshots: string[] = []
selectedScreenshot = ''
screenshotTask?: AngularFireUploadTask



title=new FormControl('',[Validators.required,Validators.maxLength(3)]);
uploadForm=new FormGroup({titile:this.title});
firebaseTimestampService: any;

  constructor(private storage:AngularFireStorage,private auth:AngularFireAuth,private clipService:ClipService,private router: Router,private dateTimeService:TimestampService,public ffmpegService:FfmpegService) {
   auth.user.subscribe(user=>this.user=user)
   this.ffmpegService.init()
   }
  
   ngOnDestroy(): void {
    this.task?.cancel();
  }

  async storeFile($event:Event){
    if(this.ffmpegService.isRunning){
      return
    }

    this.isDragover=false;

    this.file=($event as DragEvent).dataTransfer? //nullishcolateral operator use to if value is undefined return null
    ($event as DragEvent).dataTransfer?.files.item(0) ?? null : ($event.target as HTMLInputElement).files?.item(0) ?? null
    
    if(!this.file || this.file.type !== 'video/mp4'){
      return 
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file);
    this.selectedScreenshot = this.screenshots[0]

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/,''));
    this.nextStep=true;
  }

  async uploadFile(){
    this.uploadForm.disable();

    this.showAlert=true;
    this.alertColor='blue';
    this.alertMsg='Please wait ! Your clip is being uploaded';
    this.inSubmission=true;
    this.showPercentage=true;


    const clipFileName=uuid();
    const clipPath=`clips/${clipFileName}.mp4`;

    const screenshotBlob = await this.ffmpegService.blobFromURL(this.selectedScreenshot)
    const screenshotPath = `screenshots/${clipFileName}.png`

    //upload video
    this.task=this.storage.upload(clipPath,this.file);
    const clipRef=this.storage.ref(clipPath);

    //upload screenshot
    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob)
    const screenshotRef = this.storage.ref(screenshotPath)

    /*
    this.task.percentageChanges().subscribe(progress=>{
      this.percentage=progress as number/100;
    })
*/

    //this.task.snapshotChanges()
    
    //.pipe(last(),switchMap(()=>clipref.getDownloadURL()))

    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges()
    ]).subscribe((progress) => {
      const [clipProgress, screenshotProgress] = progress

      if(!clipProgress || !screenshotProgress) {
        return
      }

      const total = clipProgress + screenshotProgress
      this.percentage = total as number / 200
    })

    forkJoin([
      this.task.snapshotChanges(),
      this.screenshotTask.snapshotChanges()
    ])
    .pipe(
      switchMap(() => forkJoin([
        clipRef.getDownloadURL(),
        screenshotRef.getDownloadURL()
      ]))
    )
    .subscribe({
      next: async (urls)=>{
        const [clipURL, screenshotURL] = urls
        //getting username from email bcz displayName property of user:firebase is null
        let indexOfSign=this.user?.email?.indexOf('@');
        let userName=this.user?.email?.substring(0,indexOfSign);

        //timestamp
        let now=this.dateTimeService.dateFormatter();
        //use moment(3rd party lib) to convert string to date
        const moment = require('moment');
        const parsedDate = moment(now, "MMMM D, YYYY [at] hh:mm:ss A [UTC]Z");
        const dateObject = parsedDate.toDate();
       
        
        const clip={
          uid:this.user?.uid as string,
          displayName:userName as string,
          title:this.title.value,
          fileName: `${clipFileName}.mp4`,
          url: clipURL,
          screenshotURL,
          screenshotFileName: `${clipFileName}.png`,
          timestamp:dateObject
         // timestamp:firebase.firestore.FieldValue.serverTimestamp()
        }

        const clipDocRef = await this.clipService.createClip(clip);
        console.log(clip);
        this.alertColor='green';
        this.alertMsg='Sucess! Your clip is now ready to share with world';
        this.showPercentage=false;

        setTimeout(() => {
          this.router.navigate([
            'clip', clipDocRef.id
          ])
        }, 1000)

      },error:(error)=>{
        this.uploadForm.enable();

        this.alertColor='red';
        this.alertMsg='Upload faled! Please try again later';
        this.inSubmission=true;
        this.showPercentage=false;
        console.error(error);

      }
    })
  }

}
