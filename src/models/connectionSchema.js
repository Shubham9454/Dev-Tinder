const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored" , "interested" , "accepted" , "rejected"],
            message: `{Value} is incorrect status type.`
        },
    }

},
{
    timestamps: true
});

connectionSchema.index({fromUserId: 1 , toUserId: 1});



const connectionModel = new mongoose.model("connectionModel" , connectionSchema);

module.exports = connectionModel;