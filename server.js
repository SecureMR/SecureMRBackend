const mongoose = require("mongoose");
require("dotenv").config();

// Bring in the models

require('./models/Affiliate');
require('./models/AffiliateType');
require('./models/ARS');
require('./models/Credentials');
require('./models/Dependent');
require('./models/DocType');
require('./models/Document');
require('./models/MedicalProfessional');
require('./models/Profile');
require('./models/PSS');

const app = require('./app');

// eslint-disable-next-line no-undef
const server = app.listen(process.env.PORT || 8000, () =>{
    console.log("Server listening on port 8000")
});

// const jwt = require('jwt-then');

const Affiliate = mongoose.model("Affiliate"); 
const AffiliateType = mongoose.model("AffiliateType"); 
const ARS = mongoose.model("ARS"); 
const Credentials = mongoose.model("Credentials"); 
const Dependent = mongoose.model("Dependent"); 
const DocType = mongoose.model("DocType"); 
const Document = mongoose.model("Document"); 
const MedicalProfessional = mongoose.model("MedicalProfessional"); 
const Profile = mongoose.model("Profile"); 
const PSS = mongoose.model("PSS"); 