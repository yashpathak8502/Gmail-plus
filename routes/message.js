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
    reciever: String,
    msgtext: String
})

module.exports=mongoose.model("msg",msgSchema);