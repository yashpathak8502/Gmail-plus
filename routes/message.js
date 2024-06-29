const mongoose = require("mongoose")

const msgSchema = mongoose.Schema({
    read:{
        type:Boolean,
        default:false
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    subject:{
        type:String,
        default:"No Subject"
    },
    reciever: String,
    msgtext: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports=mongoose.model("msg",msgSchema);