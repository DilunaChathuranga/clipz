import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute,Params } from '@angular/router';
import IClip from '../models/clip.model';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  encapsulation:ViewEncapsulation.None,
  providers: [DatePipe]
})
export class ClipComponent implements OnInit {
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef
  player?:Player
  clip?: IClip


  constructor(public route: ActivatedRoute) { }

  ngOnInit(): void {
    
    //css issue
    this.player = videojs(this.target?.nativeElement)

    //resolve method data is store in data property
    this.route.data.subscribe(data => {
      this.clip = data['clip'] as IClip

      this.player?.src({
        src: this.clip.url,
        type: 'video/mp4'
      })
    })
    
  }

}
