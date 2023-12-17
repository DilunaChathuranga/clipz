import { Injectable } from '@angular/core';

interface IModal{
  id:string,
  visible:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals:IModal[]=[];

  constructor() {}

  register(id:string){
    this.modals.push({
      id,
      visible:false
    })
    console.log(this.modals);
  }
  unregister(id:string){
    this.modals=this.modals
    .filter(element=>element.id!==id);
  }
  
  isModalVisible(id:string):boolean{
    //1 way with negatiation operator
    //!! negatiation operator if we use !->then if true value return false,false return true ,if we use !!->then if true value return true,false return false
    return !!this.modals.find(element=> element.id===id)?.visible; //? optional operator

    //2 way with explicitly casting to Boolean
//    return Boolean(this.modals.find(element => element.id === id)?.visible);
  }
  
  toggleModal(id:string){
   // this.visible=!this.visible;
   const modal=this.modals.find(element=>element.id===id);
   if(modal)
    modal.visible=!modal.visible;
  }
  
}
