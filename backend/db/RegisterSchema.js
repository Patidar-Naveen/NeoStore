import mongoose from 'mongoose';
const registerSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    addresses:{
        type:Array
    },
    OTP:{
        type:Number
    },
    profilepic:{
        type: String
    },
    cart:{
        type:Array,
        default:[]
    }
    
})
export default mongoose.model("user",registerSchema)