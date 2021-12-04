const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        default: "requested",
        enum: ["requested", "accepted", "rejected"]
    }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('Contact', contactSchema);