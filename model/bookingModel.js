import mongoose from "mongoose";

const bookingShema = {
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
}
const bookingModel = mongoose.model("booking",bookingShema)
export default bookingModel