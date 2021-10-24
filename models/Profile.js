const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name is required!'
    },
    lastName: {
        type: String,
        required: 'Last name is required!'
    },
    email: {
        type: String,
        required: 'Email is required!'
    },
    address: {
        type: String,
        required: 'Address is required!'
    },
    birthDate: {
        type: Date,
        required: 'Address is required!'
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('Profile', profileSchema);