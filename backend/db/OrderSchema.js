import mongoose from 'mongoose';
const OrderSchema = new mongoose.Schema({
    user_email:{
        type:String,
        required: true, 
    },
    card_Holder_name:{
        type: String,
        required: true, 
    },
    totalAmount:{
        type:Number,
        required: true,
    },
    products:{
        type:Array,
        required: true,

    },
    address:{
        type:Array,
    },
    created_at:{
        type: Date,
        default: Date.now
    }

})
export default mongoose.model("Orders",OrderSchema)