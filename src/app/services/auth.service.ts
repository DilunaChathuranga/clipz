import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Iuser from '../models/user.model';
import { Observable, delay, filter, map, of, switchMap } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection:AngularFirestoreCollection<Iuser>
  //isAuthenticated - use $ sign to indicate as Observable
  public isAuthenticated$:Observable<boolean>
  public isAuthenticatedWithDelay$:Observable<boolean>
  private redirect=false;

  constructor(private auth:AngularFireAuth,private db:AngularFirestore,private router:Router,private route:ActivatedRoute) { 
    this.usersCollection=db.collection('users');
    this.isAuthenticated$=auth.user.pipe(
      map((user: any)=>!!user)
    )
    this.isAuthenticatedWithDelay$=this.isAuthenticated$.pipe(
      delay(1000)
    )
   this.router.events
    .pipe(filter(e=>e instanceof NavigationEnd),map(e=>this.route.firstChild),switchMap(route=>route?.data ?? of({} as any))) //if route.data not null return data else return empty obj
    .subscribe(data=>{this.redirect=data['authOnly'] ?? false })
  }

  public async createUser(userData:Iuser){
    if(!userData.password){
      throw new  Error ("Password not provided");
    }
    
    const userCredential=await this.auth.createUserWithEmailAndPassword(
      userData.email,userData.password
    )

    if(!userCredential.user){
      throw new Error("User can't be found");
    }
    await this.usersCollection.doc(userCredential.user.uid).set({ //set is add or modify data
      name:userData.name,
      email:userData.email,
      age:userData.age,
      phoneNumber:userData.phoneNumber
    })
  await  userCredential.user.updateProfile({
      displayName:userData.name
    })
  }

  public async logout($event?:Event){
    if($event){
      $event.preventDefault();
    }

    await this.auth.signOut();

    //here url is in relative 
    if(this.redirect){
    await this.router.navigateByUrl('/');
    } 

  }
}
