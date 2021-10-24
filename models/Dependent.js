const mongoose = require("mongoose");

const dependentSchema = new mongoose.Schema({
    credentials: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Credentials",
        required: "Credentials is required!"
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: "Profile is required!"
    },
    affiliate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Affiliate",
        required: "Affiliate is required!"
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('Dependent', dependentSchema);