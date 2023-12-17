//model is a interface/class that describe data in database
export default interface IUser{
    email:string,
    password?:string, //make password optional
    age:number,
    name:string,
    phoneNumber:string

}