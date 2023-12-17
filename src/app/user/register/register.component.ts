import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterValidator } from '../validators/register-validator';
import { EmailTaken } from '../validators/email-taken';
import IUser from 'src/app/models/user.model';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  {
  showAlert=false;
  alertMsg='Please Wait Your Account is being Created...';
  alertColor='blue';

  inSubmission=false;

  constructor(private auth:AuthService,private emailTaken:EmailTaken){}

  name=new FormControl('',[Validators.required,Validators.minLength(3)]);
  email=new FormControl('',[Validators.required,Validators.email],this.emailTaken.validate);
  age=new FormControl('',[Validators.required,Validators.min(18),Validators.max(100)]);
  password=new FormControl('',[Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)]);
  confirm_password=new FormControl('',[Validators.required]);
  phoneNumber=new FormControl('',[Validators.required,Validators.minLength(13),Validators.maxLength(13)]);

  registerForm=new FormGroup({
    name:this.name,
    email:this.email,
    age:this.age,
    password:this.password,
    confirm_password:this.confirm_password,
    phoneNumber:this.phoneNumber

  },[RegisterValidator.match('password','confirm_password')])

  async register(){
    this.showAlert=true;
    this.alertMsg='Please Wait Your Account is being Created...';
    this.alertColor='blue';
    this.inSubmission=true;

    
  try{
    await this.auth.createUser(this.registerForm.value as IUser);
    }catch(e){
    console.error(e);
    this.alertMsg='An unexpected error occured.Please try again later';
    this.alertColor='red';
    this.inSubmission=false;
    return 
    }
    this.alertMsg='Success! Your account has been created.';
    this.alertColor='green';
  }
}
