const mongoose = require("mongoose");

const pssSchema = new mongoose.Schema({
    medicalCenter:{
        type: String,
        required: "Medical Center name is required!"
    },
    address:{
        type: String,
        required: "Address is required!"
    },
    medicalProfessionals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalProfessional"
    }],
    credentials:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Credentials",
        required: "Credentials is required!"
    }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('PSS', pssSchema);


