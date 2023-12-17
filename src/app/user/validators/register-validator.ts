import { AbstractControl, ValidationErrors ,ValidatorFn} from "@angular/forms";

//synchronus Validator
export class RegisterValidator {

    static match(controlName:string,matchingControlName:string){
        return (group:AbstractControl):ValidationErrors | null =>{
            const control=group.get(controlName);
        const matchingControl=group.get(matchingControlName);

        if(!control || !matchingControl){
            console.error('Form controls not be founf=d in the form group');
            return {
                controlNotFound:false
            }
        }
        const error=control.value === matchingControl.value ? null: {noMatch:true}
        matchingControl.setErrors(error);
        return error;
        }
        
    }
}
