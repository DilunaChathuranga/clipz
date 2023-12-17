import { NgModule } from '@angular/core';
//browserModle and CommonModule do the same thing Imports components(Directives and Pipes).difference is browserModule provide aditional services to running app in browser
//browserModle should load to root module(AppModule),Other modules can have commonModule
import { CommonModule } from '@angular/common';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AuthModalComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,SharedModule,ReactiveFormsModule,FormsModule
  ],
  exports:[
    //AuthModule register inside UserModule,UserModule register inside AppModule.To use AuthModule in Appmodule we should export it in Usermodule.otherwise it gives -> error NG8001: 'app-auth-modal' is not a known element:
    AuthModalComponent
  ]
})
export class UserModule { }
